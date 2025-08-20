"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const toggleCampaignActive = async (id: string) => {
  const user = await currentUser();
  try {
    const campaign = await prisma.campaign.findFirst({
      where: { id, userId: user?.id as string },
      select: { id: true, isActive: true, name: true },
    });

    if (!campaign) {
      return {
        success: false,
        message: {
          title: "Campanha não encontrada",
          description: "Verifique e tente novamente.",
        },
      } as const;
    }

    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: { isActive: !campaign.isActive },
    });

    revalidatePath("/dashboard/campaigns");
    return {
      success: true,
      data: updated,
      message: {
        title: updated.isActive ? "Campanha ativada" : "Campanha pausada",
        description: `A campanha "${campaign.name}" foi ${updated.isActive ? "ativada" : "pausada"}.`,
      },
    } as const;
  } catch (error) {
    console.error("Erro ao alternar status da campanha:", error);
    return {
      success: false,
      message: {
        title: "Erro ao atualizar status",
        description: "Tente novamente em alguns instantes.",
      },
    } as const;
  }
};
