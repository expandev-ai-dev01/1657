import { executeProcedure } from '@/utils/database';
import { Task, TaskCreatePayload, TaskSearchQuery, TaskSearchResult } from './taskTypes';

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

/**
 * @summary Searches for tasks based on specified criteria.
 * @param {object} params - The parameters for searching tasks.
 * @param {number} params.idAccount - The account ID.
 * @param {TaskSearchQuery} params.query - The search query parameters.
 * @returns {Promise<TaskSearchResult>} An object containing the tasks and pagination info.
 */
export async function searchTasks(params: {
  idAccount: number;
  query: TaskSearchQuery;
}): Promise<TaskSearchResult> {
  const { idAccount, query } = params;

  const statusFilter = query.status === 'all' ? null : query.status === 'completed' ? 1 : 0;

  const procedureParams = {
    idAccount,
    searchTerm: query.searchTerm || null,
    statusFilter,
    priorityFilter: query.priority,
    idCategoryFilter: query.idCategory,
    dueDateStart: query.dueDateStart,
    dueDateEnd: query.dueDateEnd,
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
    pageNumber: query.page,
    pageSize: query.pageSize,
  };

  const resultSets = await executeProcedure('[functional].[spTaskSearch]', procedureParams);

  const tasks = (resultSets[0] as Task[]) || [];
  const total = resultSets[1] && resultSets[1][0] ? resultSets[1][0].totalCount : 0;

  return {
    tasks,
    total,
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 20,
  };
}
