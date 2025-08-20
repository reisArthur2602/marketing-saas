import {axiosConfig} from "@/lib/axios";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface SendMessageProps {
  message: string;
  to: string;
  sessionId: string;
}

const sendMessage = async ({ message, to, sessionId }: SendMessageProps) => {
  try {
    await axiosConfig.post(
      "http://localhost:3030/session/send",
      { to, message },
      { headers: { Authorization: sessionId } },
    );
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { text, sessionId, phone } = body; // 'from' = número do usuário

    if (!text || !sessionId || !phone) {
      return NextResponse.json({ success: true });
    }

    // Buscar sessão do WhatsApp para pegar o userId
    const session = await prisma.whatsAppSession.findUnique({
      where: { sessionId },
      select: { userId: true },
    });

    if (!session) return NextResponse.json({ success: true });

    const { userId } = session;

    // Buscar keywords do usuário
    const keywords = await prisma.keyword.findMany({
      where: { userId },
      include: { campaigns: { include: { template: true, exceptions: true } } },
    });

    const messageText = text.message.toLowerCase();

    // Procurar keyword que apareça na mensagem
    const keywordFound = keywords.find((k) =>
      messageText.includes(k.word.toLowerCase()),
    );

    if (!keywordFound) {
      await sendMessage({
        message: "Nenhuma palavra-chave encontrada na sua mensagem.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    // Buscar primeira campanha ativa da keyword
    const campaign = keywordFound.campaigns.find((c) => c.isActive);
    if (!campaign) {
      await sendMessage({
        message: "A campanha associada a essa palavra-chave não está ativa.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    const now = new Date();
    const today = now.getDay();

    // Validar dias da semana
    if (!campaign.daysOfWeek.includes(today)) {
      await sendMessage({
        message: "A campanha não está disponível hoje.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    // Validar horário
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime =
      campaign.startTime.getHours() * 60 + campaign.startTime.getMinutes();
    const endTime =
      campaign.endTime.getHours() * 60 + campaign.endTime.getMinutes();

    if (currentTime < startTime || currentTime > endTime) {
      await sendMessage({
        message: "A campanha não está ativa neste horário.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    // Validar exceções
    const hasException = campaign.exceptions.some((ex) => {
      const exDate = new Date(ex.date);
      return (
        exDate.getFullYear() === now.getFullYear() &&
        exDate.getMonth() === now.getMonth() &&
        exDate.getDate() === now.getDate()
      );
    });

    if (hasException) {
      await sendMessage({
        message: "Hoje é um dia de exceção, a campanha não está ativa.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    // Enviar mensagem do template
    await sendMessage({
      message: campaign.template.text,
      to: phone,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: true });
  }
};
