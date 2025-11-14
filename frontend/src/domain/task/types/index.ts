import { z } from 'zod';

export type Priority = 'Alta' | 'Média' | 'Baixa';

export interface Task {
  id: number;
  titulo: string;
  descricao?: string;
  data_vencimento?: string;
  prioridade: Priority;
  data_criacao: string;
  // ... other fields from a full task object
}

export type TaskCreatePayload = z.infer<typeof taskCreateSchema>;

export const taskCreateSchema = z.object({
  titulo: z
    .string()
    .min(1, 'O título da tarefa é obrigatório')
    .max(255, 'O título não pode ter mais de 255 caracteres'),
  descricao: z
    .string()
    .max(2000, 'A descrição não pode ter mais de 2000 caracteres')
    .optional()
    .nullable(),
  data_vencimento: z
    .string()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true;
        // Compare only the date part, ignoring time
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(date);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today;
      },
      {
        message: 'A data de vencimento não pode ser anterior à data atual',
      }
    ),
  prioridade: z.enum(['Alta', 'Média', 'Baixa']).default('Média'),
});
