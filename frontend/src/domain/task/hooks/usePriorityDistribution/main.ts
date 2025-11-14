import { useQuery } from '@tanstack/react-query';
import { taskService } from '../../services';
import type { UsePriorityDistributionOptions } from './types';
import type { PriorityDistribution } from '../../types';

/**
 * @hook usePriorityDistribution
 * @summary Hook to fetch priority distribution report data.
 * @domain task
 * @type domain-hook
 * @category data
 */
export const usePriorityDistribution = (options: UsePriorityDistributionOptions = {}) => {
  const { startDate, endDate, enabled = true } = options;

  const queryKey = ['priority-distribution', { startDate, endDate }];

  const { data, isLoading, error, refetch } = useQuery<PriorityDistribution, Error>({
    queryKey,
    queryFn: () => taskService.getPriorityDistribution(startDate, endDate),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return {
    distribution: data,
    isLoading,
    error,
    refetch,
  };
};
