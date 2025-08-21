"use server";

import { currentUser } from "@/lib/auth-js";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpsertCampaignProps {
  id?: string;
  name: string;
  templateId: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  keywords: string[];
  exceptions?: string[];
}

export const upsertCampaign = async (data: UpsertCampaignProps) => {
  if (!data.keywords || data.keywords.length === 0) {
    return {
      success: false,
      message: {
        title: "Erro",
        description: "É necessário selecionar pelo menos uma palavra-chave.",
      },
    } as const;
  }

  try {
    const user = await currentUser();
    const today = new Date().toISOString().split("T")[0];

    const startDate = new Date(`${today}T${data.startTime}:00`);
    const endDate = new Date(`${today}T${data.endTime}:00`);

    const createPayload = {
      name: data.name,
      templateId: data.templateId,
      userId: user?.id as string,
      daysOfWeek: data.daysOfWeek,
      startTime: startDate,
      endTime: endDate,
      keywords: { connect: data.keywords.map((id) => ({ id })) },
      exceptions: { connect: (data?.exceptions || []).map((id) => ({ id })) },
    } as const;

    const updatePayload = {
      name: data.name,
      templateId: data.templateId,
      daysOfWeek: data.daysOfWeek,
      startTime: startDate,
      endTime: endDate,
      keywords: { set: data.keywords.map((id) => ({ id })) },
      exceptions: { set: (data?.exceptions || []).map((id) => ({ id })) },
    } as const;

    const campaign = await prisma.campaign.upsert({
      where: { id: data.id || "" },
      update: updatePayload,
      create: createPayload,
      include: { keywords: true, exceptions: true, template: true },
    });

    revalidatePath("/dashboard/campaigns");

    return {
      success: true,
      data: campaign,
      message: {
        title: data.id ? "Campanha atualizada" : "Campanha criada",
        description: `A campanha "${data.name}" foi ${data.id ? "atualizada" : "criada"} com sucesso.`,
      },
    } as const;
  } catch (error) {
    console.error("Erro ao salvar campanha:", error);
    return {
      success: false,
      data: null,
      message: {
        title: "Erro ao salvar campanha",
        description: "Verifique os dados e tente novamente.",
      },
    } as const;
  }
};
