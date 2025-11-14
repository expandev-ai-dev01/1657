import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services';
import type { UseTasksByPriorityOptions } from './types';
import type { TasksByPriority, Task } from '../../types';

/**
 * @hook useTasksByPriority
 * @summary Hook to fetch and manage tasks filtered and sorted by priority.
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useTasksByPriority = (options: UseTasksByPriorityOptions = {}) => {
  const {
    prioridades,
    ordenacao = 'decrescente',
    agrupamento = false,
    criterio_secundario = 'data_vencimento',
    enabled = true,
  } = options;

  const queryKey = [
    'tasks-by-priority',
    { prioridades, ordenacao, agrupamento, criterio_secundario },
  ];

  const { data, isLoading, error, refetch } = useQuery<TasksByPriority | Task[], Error>({
    queryKey,
    queryFn: () =>
      taskService.listTasksByPriority({
        prioridades,
        ordenacao,
        agrupamento,
        criterio_secundario,
      }),
    enabled,
    staleTime: 2 * 60 * 1000,
  });

  return {
    tasks: data,
    isLoading,
    error,
    refetch,
  };
};
