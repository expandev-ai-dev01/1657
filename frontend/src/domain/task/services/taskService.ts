import { authenticatedClient } from '@/core/lib/api';
import type {
  Task,
  TaskCreatePayload,
  TasksByPriority,
  PriorityDistribution,
  PriorityHistoryEntry,
  PriorityFilterPayload,
} from '../types';

/**
 * @service taskService
 * @summary Task management service for authenticated endpoints.
 * @domain task
 * @type rest-service
 * @apiContext internal
 */
export const taskService = {
  /**
   * @endpoint POST /api/v1/internal/task
   * @summary Creates a new task.
   */
  async createTask(payload: TaskCreatePayload): Promise<Task> {
    const response = await authenticatedClient.post<Task>('/task', payload);
    return response.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task/priority/list
   * @summary Retrieves tasks filtered and sorted by priority level.
   */
  async listTasksByPriority(filters: PriorityFilterPayload): Promise<TasksByPriority | Task[]> {
    const params = new URLSearchParams();

    if (filters.prioridades && filters.prioridades.length > 0) {
      params.append('prioridades', filters.prioridades.join(','));
    }

    params.append('sortOrder', filters.ordenacao === 'crescente' ? 'ASC' : 'DESC');
    params.append('groupByPriority', String(filters.agrupamento));
    params.append('secondarySortCriteria', filters.criterio_secundario);

    const response = await authenticatedClient.get<TasksByPriority | Task[]>(
      `/task/priority/list?${params.toString()}`
    );
    return response.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task/reports/priority-distribution
   * @summary Generates a priority distribution report.
   */
  async getPriorityDistribution(startDate?: Date, endDate?: Date): Promise<PriorityDistribution> {
    const params = new URLSearchParams();

    if (startDate) {
      params.append('startDate', startDate.toISOString().split('T')[0]);
    }

    if (endDate) {
      params.append('endDate', endDate.toISOString().split('T')[0]);
    }

    const response = await authenticatedClient.get<PriorityDistribution>(
      `/task/reports/priority-distribution?${params.toString()}`
    );
    return response.data;
  },

  /**
   * @endpoint GET /api/v1/internal/task/:id/priority-history
   * @summary Retrieves the priority history for a specific task.
   */
  async getTaskPriorityHistory(taskId: number): Promise<PriorityHistoryEntry[]> {
    const response = await authenticatedClient.get<PriorityHistoryEntry[]>(
      `/task/${taskId}/priority-history`
    );
    return response.data;
  },
};
