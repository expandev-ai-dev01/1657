import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from '@/core/hooks';
import { taskService } from '../../services';
import type { TaskSearchQuery } from '../../types';
import type { UseSearchTasksReturn } from './types';

/**
 * @hook useSearchTasks
 * @summary Manages state and data fetching for task search.
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useSearchTasks = (): UseSearchTasksReturn => {
  const [filters, setFilters] = useState<Omit<TaskSearchQuery, 'searchTerm'>>({
    status: 'all',
    sortBy: 'relevance',
    sortDirection: 'desc',
    page: 1,
    pageSize: 20,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const queryKey = useMemo(
    () => ['searchTasks', { ...filters, searchTerm: debouncedSearchTerm }],
    [filters, debouncedSearchTerm]
  );

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey,
    queryFn: () => taskService.searchTasks({ ...filters, searchTerm: debouncedSearchTerm }),
    enabled:
      debouncedSearchTerm.length >= 2 ||
      (debouncedSearchTerm.length === 0 && Object.keys(filters).length > 4), // Search if term is long enough, or if filters are applied without a term
    placeholderData: keepPreviousData,
  });

  const handleFilterChange = (newFilters: Partial<Omit<TaskSearchQuery, 'searchTerm'>>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters: handleFilterChange,
    page: filters.page || 1,
    setPage: handlePageChange,
    result: data,
    isLoading,
    isFetching,
    error,
  };
};
