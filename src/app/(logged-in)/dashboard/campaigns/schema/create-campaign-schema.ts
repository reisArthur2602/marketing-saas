import z from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(1, "Nome da campanha é obrigatório"),
  templateId: z.string().min(1, "Template é obrigatório"),
  daysOfWeek: z.array(z.number()).min(1, "Selecione pelo menos um dia"),
  startTime: z.string(),
  endTime: z.string(),
  keywords: z.array(z.string()),
  exceptions: z.array(z.string()).optional(),
});

export type CreateCampaignSchemaForm = z.infer<typeof createCampaignSchema>;
