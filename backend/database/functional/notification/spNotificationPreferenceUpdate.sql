/**
 * @summary
 * Creates or updates the notification preferences for a user.
 * 
 * @procedure spNotificationPreferenceUpdate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - PUT /api/v1/internal/notification/preferences
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: Account identifier.
 * @param {INT} idUser 
 *   - Required: Yes
 *   - Description: User identifier.
 * @param {NVARCHAR(100)} channels
 *   - Required: Yes
 *   - Description: Comma-separated list of notification channels.
 * @param {INT} defaultLeadTimeHours
 *   - Required: Yes
 *   - Description: Default lead time in hours.
 * @param {BIT} notifyForOverdueTasks
 *   - Required: Yes
 *   - Description: Flag to notify for overdue tasks.
 * @param {NVARCHAR(50)} reminderFrequency
 *   - Required: Yes
 *   - Description: Frequency of reminders.
 * @param {BIT} notificationsActive
 *   - Required: Yes
 *   - Description: Global flag to enable/disable notifications.
 * @param {TIME} quietHourStart
 *   - Required: No
 *   - Description: Start of the quiet hours period.
 * @param {TIME} quietHourEnd
 *   - Required: No
 *   - Description: End of the quiet hours period.
 * @param {INT} historyRetentionDays
 *   - Required: Yes
 *   - Description: How many days to keep notification history.
 * 
 * @testScenarios
 * - Update preferences for an existing user.
 * - Create preferences for a new user.
 */
CREATE OR ALTER PROCEDURE [functional].[spNotificationPreferenceUpdate]
    @idAccount INT,
    @idUser INT,
    @channels NVARCHAR(100),
    @defaultLeadTimeHours INT,
    @notifyForOverdueTasks BIT,
    @reminderFrequency NVARCHAR(50),
    @notificationsActive BIT,
    @quietHourStart TIME = NULL,
    @quietHourEnd TIME = NULL,
    @historyRetentionDays INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        MERGE [functional].[notificationPreference] AS [target]
        USING (SELECT @idAccount AS [idAccount], @idUser AS [idUser]) AS [source]
        ON ([target].[idAccount] = [source].[idAccount] AND [target].[idUser] = [source].[idUser])
        WHEN MATCHED THEN
            UPDATE SET
                [channels] = @channels,
                [defaultLeadTimeHours] = @defaultLeadTimeHours,
                [notifyForOverdueTasks] = @notifyForOverdueTasks,
                [reminderFrequency] = @reminderFrequency,
                [notificationsActive] = @notificationsActive,
                [quietHourStart] = @quietHourStart,
                [quietHourEnd] = @quietHourEnd,
                [historyRetentionDays] = @historyRetentionDays,
                [dateModified] = GETUTCDATE()
        WHEN NOT MATCHED BY TARGET THEN
            INSERT (
                [idAccount], [idUser], [channels], [defaultLeadTimeHours], 
                [notifyForOverdueTasks], [reminderFrequency], [notificationsActive], 
                [quietHourStart], [quietHourEnd], [historyRetentionDays], [dateModified]
            )
            VALUES (
                @idAccount, @idUser, @channels, @defaultLeadTimeHours, 
                @notifyForOverdueTasks, @reminderFrequency, @notificationsActive, 
                @quietHourStart, @quietHourEnd, @historyRetentionDays, GETUTCDATE()
            );

        -- Return the updated/created record
        EXEC [functional].[spNotificationPreferenceGet] @idAccount = @idAccount, @idUser = @idUser;

    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END;
GO