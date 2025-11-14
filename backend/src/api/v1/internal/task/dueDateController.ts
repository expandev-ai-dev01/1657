import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/responseHandler';
import { updateTaskDueDate, removeTaskDueDate } from '@/services/task/taskDueDateService';
import { TaskUpdateDueDatePayload } from '@/services/task/taskTypes';

/**
 * @api {patch} /internal/task/:id/due-date Update Task Due Date
 * @apiName UpdateTaskDueDate
 * @apiGroup Task Due Date
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates the due date and/or due time for a task.
 *
 * @apiParam {Number} id Task ID.
 *
 * @apiBody {Date} dueDate Due date in YYYY-MM-DD format (optional).
 * @apiBody {String} dueTime Due time in HH:MM:SS format (optional, requires dueDate).
 *
 * @apiSuccess {Object} data The updated task object.
 *
 * @apiError {String} ValidationError Invalid parameters provided.
 * @apiError {String} TaskNotFound Task does not exist.
 * @apiError {String} DueDateCannotBeInThePast Due date cannot be in the past.
 * @apiError {String} DueTimeRequiresDueDate Due time requires a due date.
 * @apiError {String} ServerError Internal server error.
 */
export async function updateTaskDueDateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
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

    const payload = req.body as TaskUpdateDueDatePayload;

    const updatedTask = await updateTaskDueDate({
      idAccount,
      idTask,
      payload,
    });

    return res.status(200).json(successResponse(updatedTask));
  } catch (error: any) {
    if (error.message.includes('TaskNotFound')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'The specified task does not exist.',
        },
        timestamp: new Date().toISOString(),
      });
    }
    if (error.message.includes('DueDateCannotBeInThePast')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUE_DATE_IN_PAST',
          message: 'The due date cannot be in the past.',
        },
        timestamp: new Date().toISOString(),
      });
    }
    if (error.message.includes('DueTimeRequiresDueDate')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUE_TIME_REQUIRES_DATE',
          message: 'A due date is required to specify a due time.',
        },
        timestamp: new Date().toISOString(),
      });
    }
    return next(error);
  }
}

/**
 * @api {delete} /internal/task/:id/due-date Remove Task Due Date
 * @apiName RemoveTaskDueDate
 * @apiGroup Task Due Date
 * @apiVersion 1.0.0
 *
 * @apiDescription Removes the due date and due time from a task.
 *
 * @apiParam {Number} id Task ID.
 *
 * @apiSuccess {Object} data The updated task object.
 *
 * @apiError {String} TaskNotFound Task does not exist.
 * @apiError {String} ServerError Internal server error.
 */
export async function removeTaskDueDateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
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

    const updatedTask = await removeTaskDueDate({
      idAccount,
      idTask,
    });

    return res.status(200).json(successResponse(updatedTask));
  } catch (error: any) {
    if (error.message.includes('TaskNotFound')) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'The specified task does not exist.',
        },
        timestamp: new Date().toISOString(),
      });
    }
    return next(error);
  }
}
