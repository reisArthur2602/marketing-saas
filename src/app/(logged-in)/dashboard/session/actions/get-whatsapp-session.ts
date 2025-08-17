"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const getWhatsAppSession = async () => {
  const user = await currentUser();
  return await prisma.whatsAppSession.findUnique({
    where: { userId: user?.id },
  });
};
