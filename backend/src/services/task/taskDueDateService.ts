import { executeProcedure } from '@/utils/database';
import { Task, TaskUpdateDueDatePayload } from './taskTypes';

/**
 * @summary Updates the due date and/or due time for a task.
 * @param {object} params - The parameters for updating the due date.
 * @param {number} params.idAccount - The account ID.
 * @param {number} params.idTask - The task ID.
 * @param {TaskUpdateDueDatePayload} params.payload - The due date and time data from the request.
 * @returns {Promise<Task>} The updated task.
 */
export async function updateTaskDueDate(params: {
  idAccount: number;
  idTask: number;
  payload: TaskUpdateDueDatePayload;
}): Promise<Task> {
  const { idAccount, idTask, payload } = params;

  const procedureParams = {
    idAccount,
    idTask,
    dueDate: payload.dueDate ? new Date(payload.dueDate).toISOString().split('T')[0] : null,
    dueTime: payload.dueTime || null,
  };

  const result = await executeProcedure('[functional].[spTaskUpdateDueDate]', procedureParams);

  if (!result[0] || result[0].length === 0) {
    throw new Error('Failed to update task due date: database did not return the updated record.');
  }

  return result[0][0] as Task;
}

/**
 * @summary Removes the due date and due time from a task.
 * @param {object} params - The parameters for removing the due date.
 * @param {number} params.idAccount - The account ID.
 * @param {number} params.idTask - The task ID.
 * @returns {Promise<Task>} The updated task.
 */
export async function removeTaskDueDate(params: {
  idAccount: number;
  idTask: number;
}): Promise<Task> {
  const { idAccount, idTask } = params;

  const procedureParams = {
    idAccount,
    idTask,
  };

  const result = await executeProcedure('[functional].[spTaskRemoveDueDate]', procedureParams);

  if (!result[0] || result[0].length === 0) {
    throw new Error('Failed to remove task due date: database did not return the updated record.');
  }

  return result[0][0] as Task;
}
