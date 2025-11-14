import { z } from 'zod';
import {
  notificationPreferenceUpdateSchema,
  taskNotificationSettingUpdateSchema,
} from './notificationValidation';

// Type inferred from Zod schemas for request validation
export type NotificationPreferenceUpdatePayload = z.infer<
  typeof notificationPreferenceUpdateSchema
>['body'];
export type TaskNotificationSettingUpdatePayload = z.infer<
  typeof taskNotificationSettingUpdateSchema
>['body'];

// Type representing the NotificationPreference entity from the database
export interface NotificationPreference {
  channels: string; // Comma-separated
  defaultLeadTimeHours: number;
  notifyForOverdueTasks: boolean;
  reminderFrequency: string;
  notificationsActive: boolean;
  quietHourStart: string | null;
  quietHourEnd: string | null;
  historyRetentionDays: number;
}

// Type representing the TaskNotificationSetting entity
export interface TaskNotificationSetting {
  useCustomSettings: boolean;
  customLeadTimeHours: number | null;
  customChannels: string | null; // Comma-separated
  additionalRemindersJson: string | null; // JSON string
  taskNotificationsActive: boolean;
}

// Type representing a single Notification
export interface Notification {
  idNotification: number;
  idTask: number;
  title: string;
  content: string;
  sendDate: Date;
  readStatus: 'não lida' | 'lida' | 'descartada';
}

// Types for the Dashboard
interface DashboardTaskSummary {
  idTask: number;
  title: string;
  priority: number;
}

interface DashboardNotificationSummary {
  idNotification: number;
  title: string;
  sendDate: Date;
}

export interface NotificationDashboard {
  unreadCount: number;
  tasksDueToday: DashboardTaskSummary[];
  overdueTasks: DashboardTaskSummary[];
  upcomingTasks: DashboardTaskSummary[];
  recentNotifications: DashboardNotificationSummary[];
}
