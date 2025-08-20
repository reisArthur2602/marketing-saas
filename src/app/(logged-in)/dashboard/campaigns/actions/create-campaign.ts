"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateCampaignProps {
  name: string;
  templateId: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  keywords: string[];
  exceptions?: string[];
}

export const createCampaign = async (data: CreateCampaignProps) => {
  if (!data.keywords || data.keywords.length === 0) {
    return {
      success: false,
      message: {
        title: "Erro",
        description: "É necessário selecionar pelo menos uma palavra-chave.",
      },
    };
  }

  try {
    const user = await currentUser();
    const today = new Date().toISOString().split("T")[0];

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        templateId: data.templateId,
        userId: user?.id as string,
        daysOfWeek: data.daysOfWeek,
        startTime: new Date(`${today}T${data.startTime}:00`), 
        endTime: new Date(`${today}T${data.endTime}:00`),
        keywords: {
          connect: data.keywords.map((id) => ({ id })),
        },
        exceptions: {
          connect: data?.exceptions?.map((id) => ({ id })),
        },
      },
      include: {
        keywords: true,
        exceptions: true,
        template: true,
      },
    });

    revalidatePath("/dashboard/campaigns");

    return {
      success: true,
      data: campaign,
      message: {
        title: "Campanha criada",
        description: `A campanha "${data.name}" foi criada com sucesso.`,
      },
    };
  } catch (error) {
    console.error("Erro ao criar campanha:", error);
    return {
      success: false,
      data: null,
      message: {
        title: "Erro ao criar campanha",
        description: "Verifique os dados e tente novamente.",
      },
    };
  }
};
