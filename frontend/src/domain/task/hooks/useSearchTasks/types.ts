import type {
  TaskSearchQuery,
  PaginatedTasksResponse,
  TaskStatus,
  SortBy,
  SortDirection,
} from '../../types';

export interface UseSearchTasksReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: Omit<TaskSearchQuery, 'searchTerm'>;
  setFilters: (filters: Partial<Omit<TaskSearchQuery, 'searchTerm'>>) => void;
  page: number;
  setPage: (page: number) => void;
  result?: PaginatedTasksResponse;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
}
