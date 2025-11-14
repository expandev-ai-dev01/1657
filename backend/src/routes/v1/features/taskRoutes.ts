import { Router } from 'express';
import { validateRequest } from '@/middleware/validationMiddleware';
import { taskCreateSchema } from '@/services/task/taskValidation';
import * as taskController from '@/api/v1/internal/task/controller';
import taskPriorityRoutes from './taskPriorityRoutes';

const router = Router();

/**
 * POST /api/v1/internal/task
 * Creates a new task.
 */
router.post('/', validateRequest(taskCreateSchema), taskController.createTaskHandler);

/**
 * Priority-related routes
 */
router.use('/', taskPriorityRoutes);

export default router;
