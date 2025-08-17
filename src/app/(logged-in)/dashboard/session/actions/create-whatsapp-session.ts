"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateWhatsAppSessionProps {
  name: string;
  sessionId: string;
}

export const createWhatsAppSession = async ({
  name,
  sessionId,
}: CreateWhatsAppSessionProps) => {
  const user = await currentUser();

  await prisma.whatsAppSession.create({
    data: { name, userId: user?.id as string, sessionId },
  });
  revalidatePath('/dashboard/session')
};
