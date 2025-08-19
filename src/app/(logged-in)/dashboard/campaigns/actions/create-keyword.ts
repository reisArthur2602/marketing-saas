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
    const keyword = await prisma.keyword.create({
      data: {
        word,
        userId: user?.id as string,
      },
    });
    revalidatePath("/dashboard/campaigns");
    return {
      success: true,
      data: null,
      message: {
        title: "Palavra-chave adicionada",
        description: `"${word}" foi adicionada com sucesso.`,
      },
    };
  } catch (error) {
    console.log("Erro ao adicionar:", error);
    return {
      success: false,
      data: null,
      message: {
        title: "Palavra-chave já existe",
        description: "Esta palavra-chave já foi cadastrada.",
      },
    };
  }
};
