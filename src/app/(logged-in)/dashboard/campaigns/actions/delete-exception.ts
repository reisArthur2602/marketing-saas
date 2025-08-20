"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteException = async (id: string) => {
  const user = await currentUser();
  try {
    const result = await prisma.exception.deleteMany({
      where: { id, userId: user?.id as string },
    });

    if (result.count === 0) {
      return {
        success: false,
        message: {
          title: "Não foi possível excluir",
          description: "Exceção não encontrada ou não pertence ao usuário.",
        },
      } as const;
    }

    revalidatePath("/dashboard/campaigns");
    return {
      success: true,
      message: {
        title: "Exceção removida",
        description: "A data de exceção foi excluída com sucesso.",
      },
    } as const;
  } catch (error) {
    console.error("Erro ao excluir exceção:", error);
    return {
      success: false,
      message: {
        title: "Erro ao excluir",
        description: "Tente novamente em alguns instantes.",
      },
    } as const;
  }
};
