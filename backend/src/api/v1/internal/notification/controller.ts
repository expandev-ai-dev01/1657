import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/responseHandler';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  getTaskNotificationSettings,
  updateTaskNotificationSettings,
  listNotifications,
  updateNotificationStatus,
  getNotificationDashboard,
} from '@/services/notification/notificationService';
import {
  NotificationPreferenceUpdatePayload,
  TaskNotificationSettingUpdatePayload,
} from '@/services/notification/notificationTypes';

// FC-001: User Notification Preferences
export async function getPreferencesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idAccount = 1; // Placeholder from auth
    const idUser = 1; // Placeholder from auth

    const preferences = await getNotificationPreferences({ idAccount, idUser });
    return res.status(200).json(successResponse(preferences));
  } catch (error) {
    return next(error);
  }
}

export async function updatePreferencesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idAccount = 1; // Placeholder from auth
    const idUser = 1; // Placeholder from auth
    const payload = req.body as NotificationPreferenceUpdatePayload;

    const updatedPreferences = await updateNotificationPreferences({ idAccount, idUser, payload });
    return res.status(200).json(successResponse(updatedPreferences));
  } catch (error) {
    return next(error);
  }
}

// FC-002: Task-Specific Notification Settings
export async function getTaskSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idAccount = 1; // Placeholder from auth
    const idTask = parseInt(req.params.id, 10);

    const settings = await getTaskNotificationSettings({ idAccount, idTask });
    return res.status(200).json(successResponse(settings));
  } catch (error) {
    return next(error);
  }
}

export async function updateTaskSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idAccount = 1; // Placeholder from auth
    const idTask = parseInt(req.params.id, 10);
    const payload = req.body as TaskNotificationSettingUpdatePayload;

    const updatedSettings = await updateTaskNotificationSettings({ idAccount, idTask, payload });
    return res.status(200).json(successResponse(updatedSettings));
  } catch (error) {
    return next(error);
  }
}

// FC-004: Notification Management
export async function listNotificationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idAccount = 1; // Placeholder from auth
    const idUser = 1; // Placeholder from auth
    const { readStatus, page, pageSize } = req.query;

    const result = await listNotifications({
      idAccount,
      idUser,
      readStatus: readStatus as string | undefined,
      page: page ? parseInt(page as string, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize as string, 10) : 20,
    });

    return res.status(200).json(successResponse(result.notifications, result.metadata));
  } catch (error) {
    return next(error);
  }
}

export async function updateNotificationStatusHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idAccount = 1; // Placeholder from auth
    const idUser = 1; // Placeholder from auth
    const idNotification = parseInt(req.params.id, 10);
    const { readStatus } = req.body;

    const result = await updateNotificationStatus({
      idAccount,
      idUser,
      idNotification,
      readStatus,
    });
    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
}

// FC-005: Notification Dashboard
export async function getDashboardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const idAccount = 1; // Placeholder from auth
    const idUser = 1; // Placeholder from auth

    const dashboardData = await getNotificationDashboard({ idAccount, idUser });
    return res.status(200).json(successResponse(dashboardData));
  } catch (error) {
    return next(error);
  }
}
