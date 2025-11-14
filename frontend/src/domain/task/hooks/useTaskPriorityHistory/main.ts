import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services';
import type { UseTaskPriorityHistoryOptions } from './types';
import type { PriorityHistoryEntry } from '../../types';

/**
 * @hook useTaskPriorityHistory
 * @summary Hook to fetch priority change history for a specific task.
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useTaskPriorityHistory = (
  taskId: number,
  options: UseTaskPriorityHistoryOptions = {}
) => {
  const { enabled = true } = options;

  const queryKey = ['task-priority-history', taskId];

  const { data, isLoading, error, refetch } = useQuery<PriorityHistoryEntry[], Error>({
    queryKey,
    queryFn: () => taskService.getTaskPriorityHistory(taskId),
    enabled: enabled && !!taskId,
    staleTime: 2 * 60 * 1000,
  });

  return {
    history: data,
    isLoading,
    error,
    refetch,
  };
};
