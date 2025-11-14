import { Router } from 'express';
import internalRoutes from './internalRoutes';
import externalRoutes from './externalRoutes';

const router = Router();

// Routes that do not require authentication
router.use('/external', externalRoutes);

// Routes that require authentication
router.use('/internal', internalRoutes);

export default router;
