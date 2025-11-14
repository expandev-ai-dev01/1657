/**
 * @summary
 * Retrieves a summary of notifications and tasks for the user's dashboard.
 * 
 * @procedure spNotificationDashboardGet
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/notification/dashboard
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
 * - Retrieve dashboard for a user with tasks and notifications.
 * - Retrieve dashboard for a user with no tasks.
 */
CREATE OR ALTER PROCEDURE [functional].[spNotificationDashboardGet]
    @idAccount INT,
    @idUser INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @today DATE = CAST(GETUTCDATE() AS DATE);
    DECLARE @threeDaysLater DATE = DATEADD(day, 3, @today);

    /**
     * @output {Counters, 1, 1}
     * @column {INT} unreadCount - Total count of unread notifications.
     */
    SELECT COUNT(*) AS [unreadCount]
    FROM [functional].[notification] [ntf]
    WHERE [ntf].[idAccount] = @idAccount
      AND [ntf].[idUser] = @idUser
      AND [ntf].[readStatus] = 'não lida'
      AND [ntf].[deleted] = 0;

    /**
     * @output {TasksDueToday, n, n}
     * @column {INT} idTask - Task identifier.
     * @column {NVARCHAR} title - Task title.
     * @column {TINYINT} priority - Task priority.
     */
    SELECT 
        [tsk].[idTask],
        [tsk].[title],
        [tsk].[priority]
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idAccount] = @idAccount
      AND [tsk].[idUserResponsible] = @idUser
      AND [tsk].[dueDate] = @today
      AND [tsk].[completed] = 0
      AND [tsk].[deleted] = 0
    ORDER BY [tsk].[priority] DESC, [tsk].[dueTime] ASC;

    /**
     * @output {OverdueTasks, n, n}
     * @column {INT} idTask - Task identifier.
     * @column {NVARCHAR} title - Task title.
     * @column {TINYINT} priority - Task priority.
     */
    SELECT 
        [tsk].[idTask],
        [tsk].[title],
        [tsk].[priority]
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idAccount] = @idAccount
      AND [tsk].[idUserResponsible] = @idUser
      AND [tsk].[dueDate] < @today
      AND [tsk].[completed] = 0
      AND [tsk].[deleted] = 0
    ORDER BY [tsk].[dueDate] ASC, [tsk].[priority] DESC;

    /**
     * @output {UpcomingTasks, n, n}
     * @column {INT} idTask - Task identifier.
     * @column {NVARCHAR} title - Task title.
     * @column {TINYINT} priority - Task priority.
     */
    SELECT 
        [tsk].[idTask],
        [tsk].[title],
        [tsk].[priority]
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idAccount] = @idAccount
      AND [tsk].[idUserResponsible] = @idUser
      AND [tsk].[dueDate] > @today AND [tsk].[dueDate] <= @threeDaysLater
      AND [tsk].[completed] = 0
      AND [tsk].[deleted] = 0
    ORDER BY [tsk].[dueDate] ASC, [tsk].[priority] DESC;

    /**
     * @output {RecentNotifications, n, n}
     * @column {INT} idNotification - Notification identifier.
     * @column {NVARCHAR} title - Notification title.
     * @column {DATETIME2} sendDate - Date the notification was sent.
     */
    SELECT TOP 5
        [ntf].[idNotification],
        [ntf].[title],
        [ntf].[sendDate]
    FROM [functional].[notification] [ntf]
    WHERE [ntf].[idAccount] = @idAccount
      AND [ntf].[idUser] = @idUser
      AND [ntf].[deleted] = 0
    ORDER BY [ntf].[sendDate] DESC;

END;
GO