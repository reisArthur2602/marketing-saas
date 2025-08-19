"use server";
import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const getKeywords = async () => {
  const user = await currentUser();

  return await prisma.keyword.findMany({
    where: { userId: user?.id },
    include: { campaigns: true },
  });
};
