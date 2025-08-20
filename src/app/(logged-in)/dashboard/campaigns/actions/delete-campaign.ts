"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteCampaign = async (id: string) => {
  const user = await currentUser();
  try {
    const result = await prisma.campaign.deleteMany({
      where: { id, userId: user?.id as string },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: {
          title: "Não foi possível excluir",
          description: "Campanha não encontrada.",
        },
      } as const;
    }

    revalidatePath("/dashboard/campaigns");
    return {
      success: true,
      message: {
        title: "Campanha removida",
        description: "A campanha foi excluída com sucesso.",
      },
    } as const;
  } catch (error) {
    console.error("Erro ao excluir campanha:", error);
    return {
      success: false,
      message: {
        title: "Erro ao excluir",
        description: "Tente novamente em alguns instantes.",
      },
    } as const;
  }
};
