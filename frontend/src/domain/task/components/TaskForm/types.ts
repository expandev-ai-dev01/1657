import type { Task, TaskCreatePayload } from '../../types';

export interface TaskFormProps {
  onSuccess: (newTask: Task) => void;
  onCancel: () => void;
}

export type TaskFormData = TaskCreatePayload;
