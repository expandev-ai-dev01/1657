import { Router } from 'express';
import { authMiddleware } from '@/middleware/authMiddleware';
import * as priorityController from '@/api/v1/internal/task/priorityController';

const router = Router();

// All priority routes are protected by the auth middleware
router.use(authMiddleware);

/**
 * GET /api/v1/internal/task/priority/list
 * Retrieves tasks filtered and sorted by priority level.
 */
router.get('/priority/list', priorityController.listTasksByPriorityHandler);

/**
 * GET /api/v1/internal/task/reports/priority-distribution
 * Generates a priority distribution report.
 */
router.get('/reports/priority-distribution', priorityController.getPriorityDistributionHandler);

/**
 * GET /api/v1/internal/task/:id/priority-history
 * Retrieves the priority history for a specific task.
 */
router.get('/:id/priority-history', priorityController.getTaskPriorityHistoryHandler);

export default router;
