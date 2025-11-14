import type { NotificationPreferences, NotificationPreferenceUpdatePayload } from '../../types';

export interface NotificationSettingsFormProps {
  preferences?: NotificationPreferences;
  onSave: (data: NotificationPreferenceUpdatePayload) => void;
  isLoading: boolean;
}

export type NotificationPreferencesFormData = NotificationPreferenceUpdatePayload;
