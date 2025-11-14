import { Router } from 'express';
import { validateRequest } from '@/middleware/validationMiddleware';
import { taskCreateSchema } from '@/services/task/taskValidation';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

/**
 * POST /api/v1/internal/task
 * Creates a new task.
 */
router.post('/', validateRequest(taskCreateSchema), taskController.createTaskHandler);

export default router;
