import { zapIO } from "@/http/zapIO";
import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/utils/normalize-text";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

const findSession = cache(async ({ sessionId }: { sessionId: string }) => {
  return prisma.whatsAppSession.findUnique({
    where: { sessionId },
    select: {
      userId: true,
      user: { select: { defaultFallbackMessage: true } },
    },
  });
});

const findCampaigns = async ({ userId }: { userId: string }) => {
  return prisma.campaign.findMany({
    where: { userId, isActive: true },
    include: { template: true, exceptions: true, keywords: true },
  });
};

const saveMessage = async ({
  phone,
  userId,
  messageId,
  keywordId,
  content,
}: {
  phone: string;
  userId: string;
  messageId: string;
  keywordId: string;
  content: string;
}) => {
  await prisma.messageLog.create({
    data: { phone, userId, messageId, keywordId, content },
  });
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
    const { text, sessionId, phone, messageId } = body;

    if (!text || !sessionId || !phone || !messageId)
      return NextResponse.json({ success: true }, { status: 200 });

    const session = await findSession({ sessionId });

    if (!session) return NextResponse.json({ success: false }, { status: 400 });

    let responseMessage =
      "👋 Olá! No momento estamos fora do nosso horário de atendimento. Por favor, tente novamente mais tarde.";

    const campaigns = await findCampaigns({
      userId: session.userId,
    });
    const hasCampaign = campaigns.length > 0;
    const now = new Date();
    const today = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (hasCampaign) {
      for (const campaign of campaigns) {
        const keywordFound = campaign.keywords.find((k) =>
          normalizeText(text.message).includes(normalizeText(k.word)),
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

        if (isDayValid && !hasException && isTimeValid)
          responseMessage = campaign.template.text;

        await zapIO.sendMessage({
          message: responseMessage,
          to: phone,
          sessionId,
        });

        await saveMessage({
          content: text.message,
          keywordId: keywordFound.id,
          messageId,
          phone,
          userId: session.userId,
        });

        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    const fallbackMessage = session.user.defaultFallbackMessage;
    if (fallbackMessage) {
      await zapIO.sendMessage({
        message: fallbackMessage,
        to: phone,
        sessionId,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
