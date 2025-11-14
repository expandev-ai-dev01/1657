import { Router } from 'express';
import { authMiddleware } from '@/middleware/authMiddleware';
import { validateRequest } from '@/middleware/validationMiddleware';
import { taskUpdateDueDateSchema } from '@/services/task/taskValidation';
import * as dueDateController from '@/api/v1/internal/task/dueDateController';

const router = Router();

// All due date routes are protected by the auth middleware
router.use(authMiddleware);

/**
 * PATCH /api/v1/internal/task/:id/due-date
 * Updates the due date and/or due time for a task.
 */
router.patch(
  '/:id/due-date',
  validateRequest(taskUpdateDueDateSchema),
  dueDateController.updateTaskDueDateHandler
);

/**
 * DELETE /api/v1/internal/task/:id/due-date
 * Removes the due date and due time from a task.
 */
router.delete('/:id/due-date', dueDateController.removeTaskDueDateHandler);

export default router;
