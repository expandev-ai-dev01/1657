import { LoadingSpinner } from '@/core/components';
import {
  useNotificationPreferences,
  NotificationSettingsForm,
  type NotificationPreferenceUpdatePayload,
} from '@/domain/notification';

/**
 * @page NotificationSettingsPage
 * @summary Page for users to configure their notification preferences.
 * @domain notification
 * @type page-component
 * @category settings
 */
const NotificationSettingsPage = () => {
  const { preferences, isLoading, error, updatePreferences, isUpdating } =
    useNotificationPreferences();

  const handleSave = (data: NotificationPreferenceUpdatePayload) => {
    updatePreferences(data);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Notification Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage how and when you receive notifications about your tasks.
      </p>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 py-10">
            <p>Error loading settings: {error.message}</p>
          </div>
        )}

        {!isLoading && !error && preferences && (
          <NotificationSettingsForm
            preferences={preferences}
            onSave={handleSave}
            isLoading={isUpdating}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
