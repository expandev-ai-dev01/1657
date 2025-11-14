/**
 * @summary
 * Creates or updates the task-specific notification settings for a task.
 * 
 * @procedure spTaskNotificationSettingUpdate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - PUT /api/v1/internal/task/:id/notification-settings
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: Account identifier.
 * @param {INT} idTask 
 *   - Required: Yes
 *   - Description: Task identifier.
 * @param {BIT} useCustomSettings
 *   - Required: Yes
 *   - Description: Flag to enable/disable custom settings for the task.
 * @param {INT} customLeadTimeHours
 *   - Required: No
 *   - Description: Custom lead time in hours for this task.
 * @param {NVARCHAR(100)} customChannels
 *   - Required: No
 *   - Description: Comma-separated list of custom channels for this task.
 * @param {NVARCHAR(MAX)} additionalRemindersJson
 *   - Required: No
 *   - Description: JSON array of additional reminder datetimes.
 * @param {BIT} taskNotificationsActive
 *   - Required: Yes
 *   - Description: Flag to enable/disable notifications for this specific task.
 * 
 * @testScenarios
 * - Update settings for an existing task.
 * - Create settings for a task for the first time.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskNotificationSettingUpdate]
    @idAccount INT,
    @idTask INT,
    @useCustomSettings BIT,
    @customLeadTimeHours INT = NULL,
    @customChannels NVARCHAR(100) = NULL,
    @additionalRemindersJson NVARCHAR(MAX) = NULL,
    @taskNotificationsActive BIT
AS
BEGIN
    SET NOCOUNT ON;

    /**
     * @validation Ensure the task exists and belongs to the account.
     * @throw {TaskNotFound}
     */
    IF NOT EXISTS (SELECT 1 FROM [functional].[task] WHERE [idTask] = @idTask AND [idAccount] = @idAccount AND [deleted] = 0)
    BEGIN
        ;THROW 51000, 'TaskNotFound', 1;
    END

    BEGIN TRY
        MERGE [functional].[taskNotificationSetting] AS [target]
        USING (SELECT @idAccount AS [idAccount], @idTask AS [idTask]) AS [source]
        ON ([target].[idAccount] = [source].[idAccount] AND [target].[idTask] = [source].[idTask])
        WHEN MATCHED THEN
            UPDATE SET
                [useCustomSettings] = @useCustomSettings,
                [customLeadTimeHours] = @customLeadTimeHours,
                [customChannels] = @customChannels,
                [additionalRemindersJson] = @additionalRemindersJson,
                [taskNotificationsActive] = @taskNotificationsActive,
                [dateModified] = GETUTCDATE()
        WHEN NOT MATCHED BY TARGET THEN
            INSERT (
                [idAccount], [idTask], [useCustomSettings], [customLeadTimeHours], 
                [customChannels], [additionalRemindersJson], [taskNotificationsActive], [dateModified]
            )
            VALUES (
                @idAccount, @idTask, @useCustomSettings, @customLeadTimeHours, 
                @customChannels, @additionalRemindersJson, @taskNotificationsActive, GETUTCDATE()
            );

        -- Return the updated/created record
        EXEC [functional].[spTaskNotificationSettingGet] @idAccount = @idAccount, @idTask = @idTask;

    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END;
GO