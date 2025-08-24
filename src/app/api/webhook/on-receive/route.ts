import { zapIO } from "@/http/zapIO";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const findSession = async (sessionId: string) => {
  return await prisma.whatsAppSession.findUnique({
    where: { sessionId },
    select: {
      userId: true,
      user: { select: { defaultFallbackMessage: true } },
    },
  });
};

const findCampaigns = async (userId: string) => {
  return await prisma.campaign.findMany({
    where: { userId, isActive: true },
    include: { template: true, exceptions: true, keywords: true },
  });
};

const isExceptionDay = (exceptions: { date: Date }[], now: Date) => {
  return exceptions.some((ex) => {
    const exDate = new Date(ex.date);
    return (
      exDate.getFullYear() === now.getFullYear() &&
      exDate.getMonth() === now.getMonth() &&
      exDate.getDate() === now.getDate()
    );
  });
};

const isTimeInRange = (start: Date, end: Date, now: Date) => {
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const startTime = start.getHours() * 60 + start.getMinutes();
  const endTime = end.getHours() * 60 + end.getMinutes();
  return currentTime >= startTime && currentTime <= endTime;
};

const getCampaignResponse = (
  campaign: Awaited<ReturnType<typeof findCampaigns>>[number],
  text: string,
  now: Date,
): string | null => {
  const keywordFound = campaign.keywords.find((k) =>
    text.toLowerCase().includes(k.word.toLowerCase()),
  );
  if (!keywordFound) return null;

  const isDayValid = campaign.daysOfWeek.includes(now.getDay());
  const hasException = isExceptionDay(campaign.exceptions, now);
  const isTimeValid = isTimeInRange(campaign.startTime, campaign.endTime, now);

  if (!isDayValid || hasException)
    return "👋 Hoje não estamos atendendo. Por favor, tente em outro dia.";

  if (!isTimeValid)
    return "👋 Olá! No momento estamos fora do nosso horário de funcionamento.";

  return campaign.template.text;
};

interface Body {
  text?: { message: string };
  sessionId: string;
  phone: string;
  messageId: string;
}

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as Body;
    const { text, sessionId, phone } = body;

    if (!text || !sessionId || !phone) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const session = await findSession(sessionId);
    if (!session) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const campaigns = await findCampaigns(session.userId);
    const now = new Date();

    for (const campaign of campaigns) {
      const responseMessage = getCampaignResponse(campaign, text.message, now);
      if (!responseMessage) continue;

      await zapIO.sendMessage({
        message: responseMessage,
        to: phone,
        sessionId,
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const fallbackMessage =
      session.user.defaultFallbackMessage ||
      "👋 Olá! No momento estamos fora do nosso horário de funcionamento.";

    await zapIO.sendMessage({ message: fallbackMessage, to: phone, sessionId });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
