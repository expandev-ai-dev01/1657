import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/responseHandler';
import { createTask, searchTasks } from '@/services/task/taskService';
import { TaskCreatePayload, TaskSearchQuery } from '@/services/task/taskTypes';

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

/**
 * @api {get} /internal/task/search Search Tasks
 * @apiName SearchTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Searches for tasks based on various criteria.
 *
 * @apiQuery {String} [searchTerm] Term to search in title, description, and category.
 * @apiQuery {String} [status] Filter by status ('pending', 'completed', 'all'). Default 'all'.
 * @apiQuery {Number} [priority] Filter by priority (0=Low, 1=Medium, 2=High).
 * @apiQuery {Number} [idCategory] Filter by category ID.
 * @apiQuery {Date} [dueDateStart] Start of due date range.
 * @apiQuery {Date} [dueDateEnd] End of due date range.
 * @apiQuery {String} [sortBy] Sort criteria ('relevance', 'dateCreated', 'dueDate', 'priority'). Default 'relevance'.
 * @apiQuery {String} [sortDirection] Sort direction ('asc', 'desc'). Default 'desc'.
 * @apiQuery {Number} [page] Page number for pagination. Default 1.
 * @apiQuery {Number} [pageSize] Number of items per page. Default 20.
 *
 * @apiSuccess {Object[]} data Array of task objects.
 * @apiSuccess {Object} metadata Pagination information.
 *
 * @apiError {String} ValidationError Invalid query parameters.
 * @apiError {String} ServerError Internal server error.
 */
export async function searchTasksHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idAccount = 1; // Placeholder from auth

    const query = req.query as unknown as TaskSearchQuery;

    const result = await searchTasks({ idAccount, query });

    const metadata = {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      pageCount: Math.ceil(result.total / result.pageSize),
    };

    return res.status(200).json(successResponse(result.tasks, metadata));
  } catch (error) {
    return next(error);
  }
}
