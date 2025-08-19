"use server";
import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const getExceptions = async () => {
  const user = await currentUser();

  return await prisma.exception.findMany({
    where: { userId: user?.id },
  });
};
