import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";

export const getDashboardData = async () => {
  const user = await currentUser();

  const [
    messageCount,
    activeCampaignsCount,
    topKeywordsUsageRaw,
    recentMessages,
  ] = await Promise.all([
    prisma.messageLog.count({ where: { userId: user?.id } }),

    prisma.campaign.count({ where: { userId: user?.id, isActive: true } }),

    prisma.messageLog.groupBy({
      by: ["keywordId"],
      where: { userId: user?.id, keywordId: { not: null } },
      _count: { keywordId: true },
      orderBy: { _count: { keywordId: "desc" } },
      take: 10,
    }),

    await prisma.messageLog.findMany({
      where: { userId: user?.id },
      orderBy: { receivedAt: "desc" },
      take: 4,
      include: { keyword: true },
    }),
  ]);

  const keywordIds = topKeywordsUsageRaw.map((k) => k.keywordId!);
  const keywords = await prisma.keyword.findMany({
    where: { id: { in: keywordIds } },
    select: { id: true, word: true },
  });

  const topKeywordsUsage = topKeywordsUsageRaw.map((k) => ({
    keywordId: k.keywordId,
    count: k._count.keywordId,
    keyword: keywords.find((kw) => kw.id === k.keywordId)?.word || "",
  }));

  return {
    messageCount,
    activeCampaignsCount,
    topKeywordsUsage,
    recentMessages,
  };
};
