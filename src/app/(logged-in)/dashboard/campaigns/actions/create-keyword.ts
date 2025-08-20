"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateKeywordProps {
  word: string;
}
export const createKeyword = async ({ word }: CreateKeywordProps) => {
  const user = await currentUser();
  try {
    const existing = await prisma.keyword.findFirst({
      where: { word, userId: user?.id as string },
    });

    if (existing) {
      return {
        success: false,
        data: null,
        message: {
          title: "Palavra-chave já existe",
          description: `"${word}" já foi cadastrada para este usuário.`,
        },
      } as const;
    }

    const keyword = await prisma.keyword.create({
      data: {
        word,
        userId: user?.id as string,
      },
    });
    revalidatePath("/dashboard/campaigns");
    return {
      success: true,
      data: keyword,
      message: {
        title: "Palavra-chave adicionada",
        description: `"${word}" foi adicionada com sucesso.`,
      },
    } as const;
  } catch (error) {
    console.log("Erro ao adicionar:", error);
    return {
      success: false,
      data: null,
      message: {
        title: "Erro ao adicionar",
        description: "Tente novamente em alguns instantes.",
      },
    } as const;
  }
};
