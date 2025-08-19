import z from "zod";

export const createKeywordSchema = z.object({
  word: z
    .string("A palavra-chave é um campo obrigatório ")
    .min(2, "A palavra-chave deve ter no mínimo 2 caracteres"),
});

export type CreateKeywordSchemaForm = z.infer<typeof createKeywordSchema>;
