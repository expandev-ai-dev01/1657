import { authenticatedClient } from '@/core/lib/api';
import type { Task, TaskCreatePayload } from '../types';

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
};
