import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0); // Set to the beginning of the day for date-only comparison

export const taskCreateSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'O título da tarefa é obrigatório',
      })
      .min(1, 'O título da tarefa é obrigatório')
      .max(255, 'O título não pode ter mais de 255 caracteres'),
    description: z
      .string()
      .max(2000, 'A descrição não pode ter mais de 2000 caracteres')
      .optional()
      .nullable(),
    dueDate: z.coerce
      .date()
      .refine((date) => date >= today, {
        message: 'A data de vencimento não pode ser anterior à data atual',
      })
      .optional()
      .nullable(),
    priority: z.number().int().min(0).max(2).optional().nullable(), // 0: Low, 1: Medium, 2: High
    idCategory: z.number().int().positive().optional().nullable(),
    idUserResponsible: z.number().int().positive().optional().nullable(),
  }),
});
