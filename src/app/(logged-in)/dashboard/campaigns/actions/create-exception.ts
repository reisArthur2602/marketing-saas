"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateExceptionProps {
  description?: string;
  date: Date;
}

export const createException = async ({
  description,
  date,
}: CreateExceptionProps) => {
  const user = await currentUser();
  try {
    const exception = await prisma.exception.create({
      data: {
        description,
        date,
        userId: user?.id as string,
      },
    });
    revalidatePath("/dashboard/campaigns");
    return {
      success: true,
      data: exception,
      message: {
        title: "Exceção adicionada",
        description: `Data ${date.toLocaleDateString("pt-BR")} foi adicionada com sucesso.`,
      },
    };
  } catch (error) {
    console.log("Erro ao adicionar:", error);
    return {
      success: false,
      data: null,
      message: {
        title: "Erro ao adicionar",
        description: "Tente novamente em alguns instantes.",
      },
    };
  }
};
