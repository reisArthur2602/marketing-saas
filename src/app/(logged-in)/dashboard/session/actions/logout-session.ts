"use server";

import { zapIO } from "@/http/zapIO";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface LogoutSessionProps {
  sessionId: string;
}

export const logoutSession = async ({ sessionId }: LogoutSessionProps) => {
  const logout = await zapIO.logout({ sessionId });
  if (!logout.success) return;

  await prisma.whatsAppSession.delete({
    where: { sessionId },
  });

  revalidatePath("/dashboard/session");
};
