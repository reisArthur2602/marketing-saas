import { z } from "zod";

export const upsertDefaultTemplateSchema = z.object({
  text: z
    .string()
    .min(5, "O conteúdo da mensagem deve ter pelo menos 5 caracteres"),
});

export type UpsertDefaultTemplateForm = z.infer<typeof upsertDefaultTemplateSchema>;
