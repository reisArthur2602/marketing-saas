import { getKeywords } from "@/cached/get-keywords";
import { zapIO } from "@/http/zapIO";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { text, sessionId, phone } = body;

    if (!text || !sessionId || !phone) return NextResponse.json({ success: true });

    const session = await prisma.whatsAppSession.findUnique({
      where: { sessionId },
      select: { userId: true },
    });

    if (!session) return NextResponse.json({ success: true });

    const keywords = await getKeywords({ userId: session.userId });

    const messageText = text.message.toLowerCase();

    const keywordFound = keywords.find((k) =>
      messageText.includes(k.word.toLowerCase()),
    );

    if (!keywordFound) {
      // await zapIO.sendMessage({
      //   message: "Mensagem recebida. Entraremos em contato em breve.",
      //   to: phone,
      //   sessionId,
      // });
      return NextResponse.json({ success: true });
    }

    const campaign = keywordFound.campaigns.find((c) => c.isActive);

    if (!campaign) {
      // await zapIO.sendMessage({
      //   message: "Mensagem recebida. Em breve retornaremos o contato.",
      //   to: phone,
      //   sessionId,
      // });
      return NextResponse.json({ success: true });
    }

    const now = new Date();
    const today = now.getDay();

    if (!campaign.daysOfWeek.includes(today)) {
      await zapIO.sendMessage({
        message: "Não estamos em horário de funcionamento. Tente novamente em outro momento.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime =
      campaign.startTime.getHours() * 60 + campaign.startTime.getMinutes();
    const endTime =
      campaign.endTime.getHours() * 60 + campaign.endTime.getMinutes();

    if (currentTime < startTime || currentTime > endTime) {
      await zapIO.sendMessage({
        message: "Não estamos em horário de funcionamento. Tente novamente mais tarde.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    const hasException = campaign.exceptions.some((ex) => {
      const exDate = new Date(ex.date);
      return (
        exDate.getFullYear() === now.getFullYear() &&
        exDate.getMonth() === now.getMonth() &&
        exDate.getDate() === now.getDate()
      );
    });

    if (hasException) {
      await zapIO.sendMessage({
        message: "Hoje não estamos atendendo. Por favor, tente novamente em outro dia.",
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    await zapIO.sendMessage({
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
