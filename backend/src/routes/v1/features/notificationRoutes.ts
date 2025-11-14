import { Router } from 'express';
import { validateRequest } from '@/middleware/validationMiddleware';
import {
  notificationPreferenceUpdateSchema,
  taskNotificationSettingUpdateSchema,
  notificationListSchema,
  notificationUpdateStatusSchema,
} from '@/services/notification/notificationValidation';
import * as notificationController from '@/api/v1/internal/notification/controller';

const router = Router();

// FC-001: Configuração de Preferências de Notificação
router.get('/preferences', notificationController.getPreferencesHandler);
router.put(
  '/preferences',
  validateRequest(notificationPreferenceUpdateSchema),
  notificationController.updatePreferencesHandler
);

// FC-002: Configuração de Notificações por Tarefa
// This route is nested under tasks for semantic clarity, e.g., /api/v1/internal/task/:id/notification-settings
// We add it here to keep notification logic together, but it will be mounted on the task router.
const taskSpecificRouter = Router({ mergeParams: true });
taskSpecificRouter.get('/notification-settings', notificationController.getTaskSettingsHandler);
taskSpecificRouter.put(
  '/notification-settings',
  validateRequest(taskNotificationSettingUpdateSchema),
  notificationController.updateTaskSettingsHandler
);
// This special export will be used in taskRoutes.ts
export const taskNotificationRoutes = taskSpecificRouter;

// FC-004: Visualização e Gerenciamento de Notificações
router.get(
  '/',
  validateRequest(notificationListSchema),
  notificationController.listNotificationsHandler
);
router.patch(
  '/:id',
  validateRequest(notificationUpdateStatusSchema),
  notificationController.updateNotificationStatusHandler
);

// FC-005: Painel de Resumo de Notificações
router.get('/dashboard', notificationController.getDashboardHandler);

export default router;
