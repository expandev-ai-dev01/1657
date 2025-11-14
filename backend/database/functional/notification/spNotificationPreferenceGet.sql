/**
 * @summary
 * Retrieves the notification preferences for a specific user.
 * If no preferences exist, it returns a default set.
 * 
 * @procedure spNotificationPreferenceGet
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/notification/preferences
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: Account identifier.
 * @param {INT} idUser 
 *   - Required: Yes
 *   - Description: User identifier.
 * 
 * @testScenarios
 * - Retrieve preferences for an existing user.
 * - Retrieve preferences for a new user (should return defaults).
 */
CREATE OR ALTER PROCEDURE [functional].[spNotificationPreferenceGet]
    @idAccount INT,
    @idUser INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [functional].[notificationPreference] WHERE [idAccount] = @idAccount AND [idUser] = @idUser)
    BEGIN
        /**
         * @output {NotificationPreference, 1, 1}
         */
        SELECT 
            [channels],
            [defaultLeadTimeHours],
            [notifyForOverdueTasks],
            [reminderFrequency],
            [notificationsActive],
            [quietHourStart],
            [quietHourEnd],
            [historyRetentionDays]
        FROM [functional].[notificationPreference]
        WHERE [idAccount] = @idAccount AND [idUser] = @idUser;
    END
    ELSE
    BEGIN
        /**
         * @output {DefaultNotificationPreference, 1, 1}
         */
        SELECT 
            'aplicacao,email' AS [channels],
            24 AS [defaultLeadTimeHours],
            CAST(1 AS BIT) AS [notifyForOverdueTasks],
            'única' AS [reminderFrequency],
            CAST(1 AS BIT) AS [notificationsActive],
            NULL AS [quietHourStart],
            NULL AS [quietHourEnd],
            30 AS [historyRetentionDays];
    END
END;
GO