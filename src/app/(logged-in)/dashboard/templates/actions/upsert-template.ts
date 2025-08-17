"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpsertTemplateProps {
  name: string;
  text: string;
  templateId: string | undefined;
}

export const upsertTemplate = async ({
  name,
  text,
  templateId,
}: UpsertTemplateProps) => {
  try {
    const user = await currentUser();
    await prisma.template.upsert({
      where: {
        id: templateId || "",
      },

      update: {
        name,
        text,
      },
      create: { name, text, userId: user?.id as string },
    });
    revalidatePath("/dashboard/templates");
  } catch (error) {
    console.log("Erro ao realizar operaçãoÇ", error);
  }
};
