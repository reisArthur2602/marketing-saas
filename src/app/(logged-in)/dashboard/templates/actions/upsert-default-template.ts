"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface updateDefaultTemplateProps {
  userId: string;
  text: string;
}

export const updateDefaultTemplate = async ({
  text,
  userId,
}: updateDefaultTemplateProps) => {
  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        defaultFallbackMessage: text,
      },
    });

    revalidatePath("/dashboard/templates");

    return {
      success: true,
      data: result,
      message: {
        title: "Mensagem atualizada",
        description: "A mensagem padrão foi salva com sucesso.",
      },
    } as const;
  } catch (error) {
    console.error("Erro ao atualizar mensagem padrão:", error);
    return {
      success: false,
      message: {
        title: "Erro ao atualizar",
        description: "Não foi possível salvar a mensagem. Tente novamente.",
      },
    } as const;
  }
};
