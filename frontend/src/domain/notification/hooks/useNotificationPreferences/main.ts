import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services';
import type { NotificationPreferences, NotificationPreferenceUpdatePayload } from '../../types';
import type { UseNotificationPreferencesReturn } from './types';

const NOTIFICATION_PREFERENCES_QUERY_KEY = ['notificationPreferences'];

/**
 * @hook useNotificationPreferences
 * @summary Manages fetching and updating user notification preferences.
 * @domain notification
 * @type domain-hook
 * @category data
 */
export const useNotificationPreferences = (): UseNotificationPreferencesReturn => {
  const queryClient = useQueryClient();

  const {
    data: preferences,
    isLoading,
    error,
    refetch,
  } = useQuery<NotificationPreferences, Error>({
    queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
    queryFn: () => notificationService.getPreferences(),
  });

  const { mutate: updatePreferences, isPending: isUpdating } = useMutation<
    NotificationPreferences,
    Error,
    NotificationPreferenceUpdatePayload
  >({
    mutationFn: (payload) => notificationService.updatePreferences(payload),
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(NOTIFICATION_PREFERENCES_QUERY_KEY, updatedPreferences);
      // Optionally, invalidate other queries that might depend on these settings
    },
    onError: (error) => {
      console.error('Failed to update notification preferences:', error);
      // Here you could show a toast notification for the error
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    isUpdating,
    refetch,
  };
};
