import { z } from 'zod';
import { taskCreateSchema, taskUpdateDueDateSchema, taskSearchSchema } from './taskValidation';

// Type inferred from the Zod schema for request validation
export type TaskCreatePayload = z.infer<typeof taskCreateSchema>['body'];
export type TaskUpdateDueDatePayload = z.infer<typeof taskUpdateDueDateSchema>['body'];
export type TaskSearchQuery = z.infer<typeof taskSearchSchema>['query'];

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
  dueTime: string | null;
  priority: number; // 0: Low, 1: Medium, 2: High
  completed: boolean;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

// Type representing the Category entity
export interface Category {
  idCategory: number;
  idAccount: number;
  name: string;
  dateCreated: Date;
  dateModified: Date;
  deleted: boolean;
}

// Type for the search result payload
export interface TaskSearchResult {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
}
