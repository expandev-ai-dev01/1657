import type { NotificationPreferences, NotificationPreferenceUpdatePayload } from '../../types';

export interface UseNotificationPreferencesReturn {
  preferences?: NotificationPreferences;
  isLoading: boolean;
  error: Error | null;
  isUpdating: boolean;
  updatePreferences: (payload: NotificationPreferenceUpdatePayload) => void;
  refetch: () => void;
}
