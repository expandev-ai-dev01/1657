import { z } from 'zod';
import { taskCreateSchema } from './taskValidation';

// Type inferred from the Zod schema for request validation
export type TaskCreatePayload = z.infer<typeof taskCreateSchema>['body'];

// Type representing the Task entity from the database
export interface Task {
  idTask: number;
  idAccount: number;
  idCategory: number | null;
  idUserCreator: number;
  idUserResponsible: number;
  title: string;
  description: string | null;
  dueDate: Date | null;
  priority: number; // 0: Low, 1: Medium, 2: High
  dateCreated: Date;
  deleted: boolean;
}
