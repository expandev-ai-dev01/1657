import { Router } from 'express';
import { authMiddleware } from '@/middleware/authMiddleware';

const router = Router();

// All internal routes are protected by the auth middleware by default.
router.use(authMiddleware);

// Feature routes will be added here.
// Example:
// import taskRoutes from './features/taskRoutes';
// router.use('/tasks', taskRoutes);

export default router;
