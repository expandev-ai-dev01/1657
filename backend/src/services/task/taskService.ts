import { executeProcedure } from '@/utils/database';
import { Task, TaskCreatePayload } from './taskTypes';

/**
 * @summary Creates a new task in the database.
 * @param {object} params - The parameters for creating a task.
 * @param {number} params.idAccount - The account ID.
 * @param {number} params.idUser - The ID of the user creating the task.
 * @param {TaskCreatePayload} params.payload - The task data from the request.
 * @returns {Promise<Task>} The newly created task.
 */
export async function createTask(params: {
  idAccount: number;
  idUser: number;
  payload: TaskCreatePayload;
}): Promise<Task> {
  const { idAccount, idUser, payload } = params;

  const procedureParams = {
    idAccount,
    idUser,
    title: payload.title,
    description: payload.description,
    dueDate: payload.dueDate,
    priority: payload.priority,
    idCategory: payload.idCategory,
    idUserResponsible: payload.idUserResponsible,
  };

  const result = await executeProcedure('[functional].[spTaskCreate]', procedureParams);

  if (!result[0] || result[0].length === 0) {
    throw new Error('Failed to create task: database did not return the new record.');
  }

  return result[0][0] as Task;
}
