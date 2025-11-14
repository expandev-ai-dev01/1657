import type { PriorityConfig } from '../types';
import { taskCreateSchema } from '../types';

export const PRIORITIES: PriorityConfig[] = [
  {
    value: 'Alta',
    label: 'High',
    numericValue: 1,
    color: '#FF4D4D',
    icon: 'priority_high',
  },
  {
    value: 'Média',
    label: 'Medium',
    numericValue: 2,
    color: '#FFA64D',
    icon: 'priority_medium',
  },
  {
    value: 'Baixa',
    label: 'Low',
    numericValue: 3,
    color: '#4DA6FF',
    icon: 'priority_low',
  },
];

export const PRIORITY_MAP: Record<string, PriorityConfig> = PRIORITIES.reduce((acc, priority) => {
  acc[priority.value] = priority;
  return acc;
}, {} as Record<string, PriorityConfig>);

export const REPORT_TYPES = {
  DISTRIBUTION: 'distribuicao',
  TREND: 'tendencia',
  COMPLETION: 'conclusao',
  CHANGES: 'alteracoes',
} as const;

export const REPORT_FORMATS = {
  CHART: 'grafico',
  TABLE: 'tabela',
  CSV: 'csv',
  PDF: 'pdf',
} as const;

export { taskCreateSchema };
