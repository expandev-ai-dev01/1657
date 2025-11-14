import { z } from 'zod';

export type Priority = 'Alta' | 'Média' | 'Baixa';
export type TaskStatus = 'all' | 'pending' | 'completed';
export type SortBy = 'relevance' | 'dateCreated' | 'dueDate' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface PriorityConfig {
  value: Priority;
  label: string;
  numericValue: number;
  color: string;
  icon: string;
}

export interface Task {
  id: number;
  titulo: string;
  descricao?: string;
  data_vencimento?: string;
  prioridade: Priority;
  data_criacao: string;
  status: 'pending' | 'completed';
}

export interface TasksByPriority {
  alta: Task[];
  media: Task[];
  baixa: Task[];
}

export interface PriorityDistribution {
  alta: number;
  media: number;
  baixa: number;
  total: number;
}

export interface PriorityHistoryEntry {
  id: number;
  prioridade_anterior: Priority;
  prioridade_nova: Priority;
  motivo_alteracao?: string;
  data_alteracao: string;
  usuario_alteracao: number;
}

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

export type TaskCreatePayload = z.infer<typeof taskCreateSchema>;

export const priorityFilterSchema = z.object({
  prioridades: z.array(z.enum(['Alta', 'Média', 'Baixa'])).optional(),
  ordenacao: z.enum(['crescente', 'decrescente']).default('decrescente'),
  agrupamento: z.boolean().default(false),
  criterio_secundario: z
    .enum(['data_criacao', 'data_vencimento', 'titulo', 'categoria'])
    .default('data_vencimento'),
});

export type PriorityFilterPayload = z.infer<typeof priorityFilterSchema>;

export interface TaskSearchQuery {
  searchTerm?: string;
  status?: TaskStatus;
  priority?: number; // 0=Low, 1=Medium, 2=High
  idCategory?: number;
  dueDateStart?: string; // YYYY-MM-DD
  dueDateEnd?: string; // YYYY-MM-DD
  sortBy?: SortBy;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
}

export interface PaginatedTasksResponse {
  data: Task[];
  metadata: {
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
}
