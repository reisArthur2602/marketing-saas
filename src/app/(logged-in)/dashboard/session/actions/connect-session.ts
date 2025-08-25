"use server";

import { zapIO } from "@/http/zapIO";
import { revalidatePath } from "next/cache";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const connectSession = async () => {
  const connectSession = await zapIO.connectSession();
  if (!connectSession.success) return;

  const { sessionId, name } = connectSession.data;
  const user = await currentUser();

  await prisma.whatsAppSession.create({
    data: { name, userId: user?.id as string, sessionId },
  });
  const configWebhook = await zapIO.configWebhook({
    sessionId: connectSession.data.sessionId,
  });

  if (!configWebhook.success) return;

  revalidatePath("/dashboard/session");
};
