"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const getCampaignsData = async () => {
  const user = await currentUser();

  const [keywords, availableKeywords, exceptions, templates, campaigns] =
    await Promise.all([
      prisma.keyword.findMany({
        where: { userId: user?.id },
        include: { campaigns: true },
      }),
      prisma.keyword.findMany({
        where: {
          userId: user?.id,
          campaigns: {
            none: { isActive: true },
          },
        },
      }),
      prisma.exception.findMany({
        where: { userId: user?.id },
      }),
      prisma.template.findMany({ where: { userId: user?.id } }),

      prisma.campaign.findMany({
        where: { userId: user?.id },
        include: { keywords: true, exceptions: true, template: true },
      }),
    ]);

  return { keywords, availableKeywords, exceptions, templates, campaigns };
};
