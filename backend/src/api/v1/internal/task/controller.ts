import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/responseHandler';
import { createTask } from '@/services/task/taskService';
import { TaskCreatePayload } from '@/services/task/taskTypes';

/**
 * @api {post} /internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task.
 *
 * @apiSuccess {Object} data The created task object.
 *
 * @apiError {String} ValidationError Invalid parameters provided.
 * @apiError {String} ServerError Internal server error.
 */
export async function createTaskHandler(req: Request, res: Response, next: NextFunction) {
  try {
    // In a real application, these would come from the authenticated user session (e.g., JWT)
    const idAccount = 1; // Placeholder
    const idUser = 1; // Placeholder

    const payload = req.body as TaskCreatePayload;

    const newTask = await createTask({ idAccount, idUser, payload });

    return res.status(201).json(successResponse(newTask));
  } catch (error) {
    return next(error);
  }
}
