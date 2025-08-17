"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const getTemplates = async () => {
  const user = await currentUser();

  return await prisma.template.findMany({ where: { userId: user?.id } });
};
