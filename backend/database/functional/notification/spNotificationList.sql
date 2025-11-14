/**
 * @summary
 * Retrieves a list of notifications for a user with filtering and pagination.
 * 
 * @procedure spNotificationList
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - GET /api/v1/internal/notification
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: Account identifier.
 * @param {INT} idUser 
 *   - Required: Yes
 *   - Description: User identifier.
 * @param {NVARCHAR(50)} readStatusFilter
 *   - Required: No
 *   - Description: Filter by read status ('não lida', 'lida', 'descartada').
 * @param {INT} pageNumber
 *   - Required: No
 *   - Description: Page number for pagination.
 * @param {INT} pageSize
 *   - Required: No
 *   - Description: Number of records per page.
 * 
 * @testScenarios
 * - List all notifications for a user.
 * - List only unread notifications.
 * - Test pagination.
 */
CREATE OR ALTER PROCEDURE [functional].[spNotificationList]
    @idAccount INT,
    @idUser INT,
    @readStatusFilter NVARCHAR(50) = NULL,
    @pageNumber INT = 1,
    @pageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    IF @pageNumber < 1 SET @pageNumber = 1;
    IF @pageSize < 1 OR @pageSize > 100 SET @pageSize = 20;

    DECLARE @offset INT = (@pageNumber - 1) * @pageSize;

    /**
     * @output {Notifications, n, n}
     * @column {INT} idNotification - Notification identifier.
     * @column {INT} idTask - Associated task identifier.
     * @column {NVARCHAR} title - Notification title.
     * @column {NVARCHAR} content - Notification content.
     * @column {DATETIME2} sendDate - Date the notification was sent.
     * @column {NVARCHAR} readStatus - Read status of the notification.
     */
    SELECT
        [ntf].[idNotification],
        [ntf].[idTask],
        [ntf].[title],
        [ntf].[content],
        [ntf].[sendDate],
        [ntf].[readStatus]
    FROM [functional].[notification] [ntf]
    WHERE [ntf].[idAccount] = @idAccount
      AND [ntf].[idUser] = @idUser
      AND [ntf].[deleted] = 0
      AND (@readStatusFilter IS NULL OR [ntf].[readStatus] = @readStatusFilter)
    ORDER BY [ntf].[sendDate] DESC
    OFFSET @offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    /**
     * @output {TotalCount, 1, 1}
     * @column {INT} totalCount - Total number of matching notifications.
     */
    SELECT COUNT(*)
    FROM [functional].[notification] [ntf]
    WHERE [ntf].[idAccount] = @idAccount
      AND [ntf].[idUser] = @idUser
      AND [ntf].[deleted] = 0
      AND (@readStatusFilter IS NULL OR [ntf].[readStatus] = @readStatusFilter);

END;
GO