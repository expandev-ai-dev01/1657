import type { Task } from '../../types';

export interface UseCreateTaskOptions {
  onSuccess?: (data: Task) => void;
  onError?: (error: Error) => void;
}
