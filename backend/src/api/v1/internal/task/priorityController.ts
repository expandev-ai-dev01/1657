import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/responseHandler';
import {
  getTasksByPriority,
  getPriorityDistribution,
  getTaskPriorityHistory,
} from '@/services/task/taskPriorityService';

/**
 * @api {get} /internal/task/priority/list List Tasks by Priority
 * @apiName ListTasksByPriority
 * @apiGroup Task Priority
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves tasks filtered and sorted by priority level.
 *
 * @apiQuery {String} sortOrder Sort order ('ASC' or 'DESC'). Default 'DESC'.
 * @apiQuery {Boolean} groupByPriority Whether to group tasks by priority. Default false.
 * @apiQuery {String} secondarySortCriteria Secondary sort criteria ('dueDate', 'dateCreated', 'title'). Default 'dueDate'.
 *
 * @apiSuccess {Object} data Array of tasks sorted by priority.
 *
 * @apiError {String} ValidationError Invalid parameters provided.
 * @apiError {String} ServerError Internal server error.
 */
export async function listTasksByPriorityHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  try {
    // Placeholder: In a real application, these would come from the authenticated user session
    const idAccount = 1;

    const {
      sortOrder = 'DESC',
      groupByPriority = false,
      secondarySortCriteria = 'dueDate',
    } = req.query;

    const tasks = await getTasksByPriority({
      idAccount,
      sortOrder: String(sortOrder),
      groupByPriority: groupByPriority === 'true',
      secondarySortCriteria: String(secondarySortCriteria),
    });

    return res.status(200).json(successResponse(tasks));
  } catch (error) {
    return next(error) as any;
  }
}

/**
 * @api {get} /internal/task/reports/priority-distribution Priority Distribution Report
 * @apiName GetPriorityDistribution
 * @apiGroup Task Priority
 * @apiVersion 1.0.0
 *
 * @apiDescription Generates a report showing the distribution of tasks by priority level.
 *
 * @apiQuery {Date} startDate Start date for filtering tasks (optional).
 * @apiQuery {Date} endDate End date for filtering tasks (optional).
 *
 * @apiSuccess {Object} data Priority distribution report.
 *
 * @apiError {String} ValidationError Invalid parameters provided.
 * @apiError {String} ServerError Internal server error.
 */
export async function getPriorityDistributionHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  try {
    // Placeholder: In a real application, these would come from the authenticated user session
    const idAccount = 1;

    const { startDate, endDate } = req.query;

    const distribution = await getPriorityDistribution({
      idAccount,
      startDate: startDate ? new Date(String(startDate)) : undefined,
      endDate: endDate ? new Date(String(endDate)) : undefined,
    });

    return res.status(200).json(successResponse(distribution));
  } catch (error) {
    return next(error) as any;
  }
}

/**
 * @api {get} /internal/task/:id/priority-history Task Priority History
 * @apiName GetTaskPriorityHistory
 * @apiGroup Task Priority
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves the priority history for a specific task.
 *
 * @apiParam {Number} id Task ID.
 *
 * @apiSuccess {Object} data Priority history for the task.
 *
 * @apiError {String} ValidationError Invalid parameters provided.
 * @apiError {String} ServerError Internal server error.
 */
export async function getTaskPriorityHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> {
  try {
    // Placeholder: In a real application, these would come from the authenticated user session
    const idAccount = 1;

    const { id } = req.params;
    const idTask = parseInt(id, 10);

    if (isNaN(idTask)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_TASK_ID',
          message: 'Task ID must be a valid number.',
        },
        timestamp: new Date().toISOString(),
      });
    }

    const history = await getTaskPriorityHistory({
      idAccount,
      idTask,
    });

    return res.status(200).json(successResponse(history));
  } catch (error) {
    return next(error) as any;
  }
}
