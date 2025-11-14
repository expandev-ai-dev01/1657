import { Router } from 'express';
import { validateRequest } from '@/middleware/validationMiddleware';
import { taskCreateSchema, taskSearchSchema } from '@/services/task/taskValidation';
import * as taskController from '@/api/v1/internal/task/controller';
import taskPriorityRoutes from './taskPriorityRoutes';
import taskDueDateRoutes from './taskDueDateRoutes';
import { taskNotificationRoutes } from './notificationRoutes';

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

/**
 * Notification settings routes for a specific task
 * e.g., /api/v1/internal/task/:id/notification-settings
 */
router.use('/:id', taskNotificationRoutes);

export default router;
