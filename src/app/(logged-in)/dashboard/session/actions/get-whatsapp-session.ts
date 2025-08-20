"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getWhatsAppSession = cache(async () => {
  const user = await currentUser();
  return await prisma.whatsAppSession.findUnique({
    where: { userId: user?.id },
  });
});
