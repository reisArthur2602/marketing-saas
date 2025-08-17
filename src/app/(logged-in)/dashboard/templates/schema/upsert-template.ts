import { z } from "zod";

export const upsertTemplateSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  text: z
    .string()
    .min(5, "O conteúdo da mensagem deve ter pelo menos 5 caracteres"),
});

export type UpsertTemplateForm = z.infer<typeof upsertTemplateSchema>;
