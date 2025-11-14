import { Router } from 'express';
import { validateRequest } from '@/middleware/validationMiddleware';
import { taskCreateSchema, taskSearchSchema } from '@/services/task/taskValidation';
import * as taskController from '@/api/v1/internal/task/controller';
import taskPriorityRoutes from './taskPriorityRoutes';
import taskDueDateRoutes from './taskDueDateRoutes';

const router = Router();

/**
 * GET /api/v1/internal/task/search
 * Searches for tasks.
 */
router.get('/search', validateRequest(taskSearchSchema), taskController.searchTasksHandler);

/**
 * POST /api/v1/internal/task
 * Creates a new task.
 */
router.post('/', validateRequest(taskCreateSchema), taskController.createTaskHandler);

/**
 * Priority-related routes
 */
router.use('/', taskPriorityRoutes);

/**
 * Due date-related routes
 */
router.use('/', taskDueDateRoutes);

export default router;
