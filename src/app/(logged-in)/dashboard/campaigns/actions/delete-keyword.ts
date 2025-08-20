"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteKeyword = async (id: string) => {
  const user = await currentUser();
  try {
    const keyword = await prisma.keyword.findFirst({
      where: { id, userId: user?.id as string },
      include: { campaigns: true },
    });

    if (!keyword) {
      return {
        success: false,
        message: {
          title: "Não foi possível excluir",
          description: "Palavra-chave não encontrada.",
        },
      } as const;
    }

    const inUse = keyword.campaigns.some((c) => c.isActive);
    if (inUse) {
      return {
        success: false,
        message: {
          title: "Palavra-chave em uso",
          description:
            "Desative ou remova a campanha antes de excluir a palavra.",
        },
      } as const;
    }

    await prisma.keyword.delete({ where: { id } });

    revalidatePath("/dashboard/campaigns");
    return {
      success: true,
      message: {
        title: "Palavra-chave removida",
        description: "A palavra-chave foi excluída com sucesso.",
      },
    } as const;
  } catch (error) {
    console.error("Erro ao excluir palavra-chave:", error);
    return {
      success: false,
      message: {
        title: "Erro ao excluir",
        description: "Tente novamente em alguns instantes.",
      },
    } as const;
  }
};
