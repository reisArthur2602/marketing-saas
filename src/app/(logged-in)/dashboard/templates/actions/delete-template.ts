"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteTemplate = async (id: string) => {
  const user = await currentUser();
  try {
    const result = await prisma.template.delete({
      where: { id, userId: user?.id as string },
    });

    revalidatePath("/dashboard/templates");
    return {
      success: true,
      data: result,
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
