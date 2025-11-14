import { executeProcedure } from '@/utils/database';
import { Task } from './taskTypes';

/**
 * @summary Retrieves tasks filtered and sorted by priority.
 * @param {object} params - The parameters for retrieving tasks by priority.
 * @param {number} params.idAccount - The account ID.
 * @param {string} params.sortOrder - Sort order ('ASC' or 'DESC'). Default 'DESC'.
 * @param {boolean} params.groupByPriority - Whether to group tasks by priority. Default false.
 * @param {string} params.secondarySortCriteria - Secondary sort criteria ('dueDate', 'dateCreated', 'title'). Default 'dueDate'.
 * @returns {Promise<Task[]>} List of tasks sorted by priority.
 */
export async function getTasksByPriority(params: {
  idAccount: number;
  sortOrder?: string;
  groupByPriority?: boolean;
  secondarySortCriteria?: string;
}): Promise<Task[]> {
  const {
    idAccount,
    sortOrder = 'DESC',
    groupByPriority = false,
    secondarySortCriteria = 'dueDate',
  } = params;

  const procedureParams = {
    idAccount,
    sortOrder,
    groupByPriority: groupByPriority ? 1 : 0,
    secondarySortCriteria,
  };

  const result = await executeProcedure('[functional].[spTaskListByPriority]', procedureParams);

  if (!result[0]) {
    return [];
  }

  return result[0] as Task[];
}

/**
 * @summary Generates a priority distribution report for tasks.
 * @param {object} params - The parameters for generating the report.
 * @param {number} params.idAccount - The account ID.
 * @param {Date} params.startDate - Start date for filtering tasks (optional).
 * @param {Date} params.endDate - End date for filtering tasks (optional).
 * @returns {Promise<Array>} Distribution of tasks by priority.
 */
export async function getPriorityDistribution(params: {
  idAccount: number;
  startDate?: Date;
  endDate?: Date;
}): Promise<
  Array<{
    priority: number;
    priorityLabel: string;
    taskCount: number;
    percentage: number;
  }>
> {
  const { idAccount, startDate, endDate } = params;

  const procedureParams = {
    idAccount,
    startDate: startDate ? startDate.toISOString().split('T')[0] : null,
    endDate: endDate ? endDate.toISOString().split('T')[0] : null,
  };

  const result = await executeProcedure(
    '[functional].[spTaskPriorityDistribution]',
    procedureParams
  );

  if (!result[0]) {
    return [];
  }

  return result[0] as Array<{
    priority: number;
    priorityLabel: string;
    taskCount: number;
    percentage: number;
  }>;
}

/**
 * @summary Retrieves the priority history for a specific task.
 * @param {object} params - The parameters for retrieving priority history.
 * @param {number} params.idAccount - The account ID.
 * @param {number} params.idTask - The task ID.
 * @returns {Promise<Array>} Priority history for the task.
 */
export async function getTaskPriorityHistory(params: {
  idAccount: number;
  idTask: number;
}): Promise<
  Array<{
    idTask: number;
    priority: number;
    priorityLabel: string;
    dateCreated: Date;
  }>
> {
  const { idAccount, idTask } = params;

  const procedureParams = {
    idAccount,
    idTask,
  };

  const result = await executeProcedure('[functional].[spTaskPriorityHistory]', procedureParams);

  if (!result[0]) {
    return [];
  }

  return result[0] as Array<{
    idTask: number;
    priority: number;
    priorityLabel: string;
    dateCreated: Date;
  }>;
}
