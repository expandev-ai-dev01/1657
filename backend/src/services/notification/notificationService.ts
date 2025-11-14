import { executeProcedure } from '@/utils/database';
import {
  NotificationPreference,
  NotificationPreferenceUpdatePayload,
  TaskNotificationSetting,
  TaskNotificationSettingUpdatePayload,
  Notification,
  NotificationDashboard,
} from './notificationTypes';

/**
 * @summary Retrieves notification preferences for a user.
 */
export async function getNotificationPreferences(params: {
  idAccount: number;
  idUser: number;
}): Promise<NotificationPreference> {
  const result = await executeProcedure('[functional].[spNotificationPreferenceGet]', params);
  return result[0][0] as NotificationPreference;
}

/**
 * @summary Updates notification preferences for a user.
 */
export async function updateNotificationPreferences(params: {
  idAccount: number;
  idUser: number;
  payload: NotificationPreferenceUpdatePayload;
}): Promise<NotificationPreference> {
  const { idAccount, idUser, payload } = params;
  const procedureParams = {
    idAccount,
    idUser,
    channels: payload.canais_notificacao.join(','),
    defaultLeadTimeHours: payload.antecedencia_padrao,
    notifyForOverdueTasks: payload.notificar_tarefas_vencidas,
    reminderFrequency: payload.frequencia_lembretes,
    notificationsActive: payload.notificacoes_ativas,
    quietHourStart: payload.horario_silencioso_inicio || null,
    quietHourEnd: payload.horario_silencioso_fim || null,
    historyRetentionDays: payload.tempo_retencao_historico,
  };
  const result = await executeProcedure(
    '[functional].[spNotificationPreferenceUpdate]',
    procedureParams
  );
  return result[0][0] as NotificationPreference;
}

/**
 * @summary Retrieves task-specific notification settings.
 */
export async function getTaskNotificationSettings(params: {
  idAccount: number;
  idTask: number;
}): Promise<TaskNotificationSetting> {
  const result = await executeProcedure('[functional].[spTaskNotificationSettingGet]', params);
  return result[0][0] as TaskNotificationSetting;
}

/**
 * @summary Updates task-specific notification settings.
 */
export async function updateTaskNotificationSettings(params: {
  idAccount: number;
  idTask: number;
  payload: TaskNotificationSettingUpdatePayload;
}): Promise<TaskNotificationSetting> {
  const { idAccount, idTask, payload } = params;
  const procedureParams = {
    idAccount,
    idTask,
    useCustomSettings: payload.usar_config_personalizada,
    customLeadTimeHours: payload.antecedencia_personalizada || null,
    customChannels: payload.canais_notificacao_tarefa?.join(',') || null,
    additionalRemindersJson: payload.lembretes_adicionais
      ? JSON.stringify(payload.lembretes_adicionais)
      : null,
    taskNotificationsActive: payload.notificacoes_tarefa_ativas,
  };
  const result = await executeProcedure(
    '[functional].[spTaskNotificationSettingUpdate]',
    procedureParams
  );
  return result[0][0] as TaskNotificationSetting;
}

/**
 * @summary Lists notifications for a user with pagination.
 */
export async function listNotifications(params: {
  idAccount: number;
  idUser: number;
  readStatus?: string;
  page: number;
  pageSize: number;
}) {
  const { idAccount, idUser, readStatus, page, pageSize } = params;
  const procedureParams = {
    idAccount,
    idUser,
    readStatusFilter: readStatus || null,
    pageNumber: page,
    pageSize,
  };
  const resultSets = await executeProcedure('[functional].[spNotificationList]', procedureParams);
  const notifications = (resultSets[0] as Notification[]) || [];
  const total = resultSets[1]?.[0]?.totalCount || 0;

  return {
    notifications,
    metadata: {
      page,
      pageSize,
      total,
      pageCount: Math.ceil(total / pageSize),
    },
  };
}

/**
 * @summary Updates the read status of a notification.
 */
export async function updateNotificationStatus(params: {
  idAccount: number;
  idUser: number;
  idNotification: number;
  readStatus: 'lida' | 'descartada';
}): Promise<{ success: boolean }> {
  const result = await executeProcedure('[functional].[spNotificationUpdateStatus]', params);
  return { success: result[0][0].success };
}

/**
 * @summary Retrieves data for the notification dashboard.
 */
export async function getNotificationDashboard(params: {
  idAccount: number;
  idUser: number;
}): Promise<NotificationDashboard> {
  const resultSets = await executeProcedure('[functional].[spNotificationDashboardGet]', params);
  return {
    unreadCount: resultSets[0]?.[0]?.unreadCount || 0,
    tasksDueToday: resultSets[1] || [],
    overdueTasks: resultSets[2] || [],
    upcomingTasks: resultSets[3] || [],
    recentNotifications: resultSets[4] || [],
  };
}
