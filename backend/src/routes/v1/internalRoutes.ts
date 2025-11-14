import { Router } from 'express';
import { authMiddleware } from '@/middleware/authMiddleware';
import taskRoutes from './features/taskRoutes';
import notificationRoutes from './features/notificationRoutes';

const router = Router();

// All internal routes are protected by the auth middleware by default.
router.use(authMiddleware);

// Feature routes will be added here.
router.use('/task', taskRoutes);
router.use('/notification', notificationRoutes);

export default router;
