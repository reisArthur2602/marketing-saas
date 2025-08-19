import z from "zod";

export const createExceptionSchema = z.object({
  description: z.string().optional(),
  date: z.date(),
});

export type CreateExceptionSchemaForm = z.infer<typeof createExceptionSchema>;
