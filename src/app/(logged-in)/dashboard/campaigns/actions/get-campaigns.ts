"use server";
import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const getCampaigns = async () => {
  const user = await currentUser();

  return await prisma.campaign.findMany({
    where: { userId: user?.id },
    include: { keywords: true, exceptions: true, template: true },
  });
};
