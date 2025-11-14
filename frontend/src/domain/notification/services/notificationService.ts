import { authenticatedClient } from '@/core/lib/api';
import type { NotificationPreferences, NotificationPreferenceUpdatePayload } from '../types';

/**
 * @service notificationService
 * @summary Service for managing notification preferences.
 * @domain notification
 * @type rest-service
 * @apiContext internal
 */
export const notificationService = {
  /**
   * @endpoint GET /api/v1/internal/notification/preferences
   * @summary Fetches the user's current notification preferences.
   */
  async getPreferences(): Promise<NotificationPreferences> {
    const response = await authenticatedClient.get('/notification/preferences');
    return response.data.data; // Assuming response is wrapped in a 'data' object
  },

  /**
   * @endpoint PUT /api/v1/internal/notification/preferences
   * @summary Updates the user's notification preferences.
   */
  async updatePreferences(
    payload: NotificationPreferenceUpdatePayload
  ): Promise<NotificationPreferences> {
    const response = await authenticatedClient.put('/notification/preferences', payload);
    return response.data.data;
  },
};
