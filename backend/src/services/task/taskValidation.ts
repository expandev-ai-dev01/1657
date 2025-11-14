import { z } from 'zod';

const today = new Date();
today.setHours(0, 0, 0, 0); // Set to the beginning of the day for date-only comparison

const maxFutureDate = new Date();
maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 100);

export const taskCreateSchema = z.object({
  body: z
    .object({
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
        .refine((date) => date <= maxFutureDate, {
          message: 'A data de vencimento não pode ser superior a 100 anos no futuro',
        })
        .optional()
        .nullable(),
      dueTime: z
        .string()
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
          'O formato de hora deve ser HH:MM:SS'
        )
        .optional()
        .nullable(),
      priority: z.number().int().min(0).max(2).optional().nullable(), // 0: Low, 1: Medium, 2: High
      idCategory: z.number().int().positive().optional().nullable(),
      idUserResponsible: z.number().int().positive().optional().nullable(),
    })
    .refine(
      (data) => {
        // If dueTime is provided, dueDate must also be provided
        if (data.dueTime && !data.dueDate) {
          return false;
        }
        return true;
      },
      {
        message: 'É necessário definir uma data de vencimento para especificar um horário',
        path: ['dueTime'],
      }
    ),
});

export const taskUpdateDueDateSchema = z.object({
  body: z
    .object({
      dueDate: z.coerce
        .date()
        .refine((date) => date >= today, {
          message: 'A data de vencimento não pode ser anterior à data atual',
        })
        .refine((date) => date <= maxFutureDate, {
          message: 'A data de vencimento não pode ser superior a 100 anos no futuro',
        })
        .optional()
        .nullable(),
      dueTime: z
        .string()
        .regex(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
          'O formato de hora deve ser HH:MM:SS'
        )
        .optional()
        .nullable(),
    })
    .refine(
      (data) => {
        // If dueTime is provided, dueDate must also be provided
        if (data.dueTime && !data.dueDate) {
          return false;
        }
        return true;
      },
      {
        message: 'É necessário definir uma data de vencimento para especificar um horário',
        path: ['dueTime'],
      }
    ),
});

export const taskSearchSchema = z.object({
  query: z
    .object({
      searchTerm: z
        .string()
        .max(100, 'O termo de busca não pode exceder 100 caracteres')
        .optional(),
      status: z.enum(['pending', 'completed', 'all']).optional().default('all'),
      priority: z.coerce.number().int().min(0).max(2).optional(),
      idCategory: z.coerce.number().int().positive().optional(),
      dueDateStart: z.coerce.date().optional(),
      dueDateEnd: z.coerce.date().optional(),
      sortBy: z
        .enum(['relevance', 'dateCreated', 'dueDate', 'priority'])
        .optional()
        .default('relevance'),
      sortDirection: z.enum(['asc', 'desc']).optional().default('desc'),
      page: z.coerce.number().int().min(1).optional().default(1),
      pageSize: z.coerce.number().int().min(10).max(50).optional().default(20),
    })
    .refine(
      (data) => {
        if (data.dueDateStart && data.dueDateEnd) {
          return data.dueDateEnd >= data.dueDateStart;
        }
        return true;
      },
      {
        message: 'A data final do filtro deve ser maior ou igual à data inicial',
        path: ['dueDateEnd'],
      }
    ),
});
