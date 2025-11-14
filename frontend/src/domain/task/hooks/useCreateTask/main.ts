import { useMutation } from '@tanstack/react-query';
import { taskService } from '../../services';
import type { UseCreateTaskOptions } from './types';
import type { Task, TaskCreatePayload } from '../../types';

/**
 * @hook useCreateTask
 * @summary Hook to handle the creation of a new task.
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useCreateTask = ({ onSuccess, onError }: UseCreateTaskOptions = {}) => {
  return useMutation<Task, Error, TaskCreatePayload>({
    mutationFn: (payload) => taskService.createTask(payload),
    onSuccess: (data) => {
      // In a real app, you would invalidate queries here, e.g.,
      // queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error('Failed to create task:', error);
      if (onError) {
        onError(error);
      }
    },
  });
};
