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

    if (!session) {
      return NextResponse.json({ success: true, data: null, message: null });
    }

    const campaigns = await prisma.campaign.findMany({
      where: { userId: session.userId, isActive: true },
      include: { template: true, exceptions: true, keywords: true },
    });

    const now = new Date();
    const today = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const genericMessage =
      "👋 Olá! No momento estamos fora do nosso horário de funcionamento.";

    let responseMessage = null;

    for (const campaign of campaigns) {
      const keywordFound = campaign.keywords.find((k) =>
        text.message.toLowerCase().includes(k.word.toLowerCase()),
      );

      if (!keywordFound) continue;

      const isDayValid = campaign.daysOfWeek.includes(today);

      const hasException = campaign.exceptions.some((ex) => {
        const exDate = new Date(ex.date);
        return (
          exDate.getFullYear() === now.getFullYear() &&
          exDate.getMonth() === now.getMonth() &&
          exDate.getDate() === now.getDate()
        );
      });

      const startTime =
        campaign.startTime.getHours() * 60 + campaign.startTime.getMinutes();
      const endTime =
        campaign.endTime.getHours() * 60 + campaign.endTime.getMinutes();
      const isTimeValid = currentTime >= startTime && currentTime <= endTime;

      if (!isDayValid || hasException) {
        responseMessage =
          "👋 Hoje não estamos atendendo. Por favor, tente em outro dia.";
      } else if (!isTimeValid) {
        responseMessage = genericMessage;
      } else {
        responseMessage = campaign.template.text;
      }

      await zapIO.sendMessage({
        message: responseMessage,
        to: phone,
        sessionId,
      });

      return NextResponse.json({ success: true, message: responseMessage });
    }

    return NextResponse.json({ success: true, message: responseMessage });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: null, message: null });
  }
};
