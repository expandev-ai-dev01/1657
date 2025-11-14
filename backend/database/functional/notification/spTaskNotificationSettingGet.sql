/**
 * @summary
 * Retrieves the task-specific notification settings for a given task.
 * If no specific settings exist, it returns a default set.
 * 
 * @procedure spTaskNotificationSettingGet
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/task/:id/notification-settings
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: Account identifier.
 * @param {INT} idTask 
 *   - Required: Yes
 *   - Description: Task identifier.
 * 
 * @testScenarios
 * - Retrieve settings for a task with custom settings.
 * - Retrieve settings for a task without custom settings (should return defaults).
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskNotificationSettingGet]
    @idAccount INT,
    @idTask INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [functional].[taskNotificationSetting] WHERE [idAccount] = @idAccount AND [idTask] = @idTask)
    BEGIN
        /**
         * @output {TaskNotificationSetting, 1, 1}
         */
        SELECT 
            [useCustomSettings],
            [customLeadTimeHours],
            [customChannels],
            [additionalRemindersJson],
            [taskNotificationsActive]
        FROM [functional].[taskNotificationSetting]
        WHERE [idAccount] = @idAccount AND [idTask] = @idTask;
    END
    ELSE
    BEGIN
        /**
         * @output {DefaultTaskNotificationSetting, 1, 1}
         */
        SELECT 
            CAST(0 AS BIT) AS [useCustomSettings],
            NULL AS [customLeadTimeHours],
            NULL AS [customChannels],
            NULL AS [additionalRemindersJson],
            CAST(1 AS BIT) AS [taskNotificationsActive];
    END
END;
GO