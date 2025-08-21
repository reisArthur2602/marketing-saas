import { zapIO } from "@/http/zapIO";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { text, sessionId, phone } = body;

    if (!text || !sessionId || !phone) {
      return NextResponse.json({ success: true, data: null, message: null });
    }

    const session = await prisma.whatsAppSession.findUnique({
      where: { sessionId },
      select: { userId: true },
    });

    if (!session)
      return NextResponse.json({ success: true, data: null, message: null });

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.userId, isActive: true },
      include: { template: true, exceptions: true, keywords: true },
    });

    const now = new Date();
    const today = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const genericMessage =
      "Olá! No momento estamos fora do nosso horário de funcionamento.";

    const activeCampaign = campaigns.find((c) => {
      const startTime = c.startTime.getHours() * 60 + c.startTime.getMinutes();
      const endTime = c.endTime.getHours() * 60 + c.endTime.getMinutes();

      const isDayValid = c.daysOfWeek.includes(today);
      const isTimeValid = currentTime >= startTime && currentTime <= endTime;
      const hasException = c.exceptions.some((ex) => {
        const exDate = new Date(ex.date);
        return (
          exDate.getFullYear() === now.getFullYear() &&
          exDate.getMonth() === now.getMonth() &&
          exDate.getDate() === now.getDate()
        );
      });

      return isDayValid && isTimeValid && !hasException;
    });

    if (!activeCampaign) {
      await zapIO.sendMessage({
        message: genericMessage,
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true });
    }

    const messageText = text.message.toLowerCase();
    const keywordFound = activeCampaign.keywords.find((k) =>
      messageText.includes(k.word.toLowerCase()),
    );

    if (!keywordFound) {
      return NextResponse.json({ success: true });
    }

    // Enviar template associado
    await zapIO.sendMessage({
      message: activeCampaign.template.text,
      to: phone,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: null, message: null });
  }
};
