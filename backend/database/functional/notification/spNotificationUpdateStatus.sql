/**
 * @summary
 * Updates the status of a single notification (e.g., marks as read).
 * 
 * @procedure spNotificationUpdateStatus
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - PATCH /api/v1/internal/notification/:id
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: Account identifier.
 * @param {INT} idUser 
 *   - Required: Yes
 *   - Description: User identifier for validation.
 * @param {INT} idNotification
 *   - Required: Yes
 *   - Description: The ID of the notification to update.
 * @param {NVARCHAR(50)} readStatus
 *   - Required: Yes
 *   - Description: The new read status ('lida', 'descartada').
 * 
 * @testScenarios
 * - Mark a notification as read.
 * - Mark a notification as discarded.
 * - Attempt to update a notification for another user.
 */
CREATE OR ALTER PROCEDURE [functional].[spNotificationUpdateStatus]
    @idAccount INT,
    @idUser INT,
    @idNotification INT,
    @readStatus NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    /**
     * @validation Ensure the new status is valid.
     * @throw {InvalidReadStatus}
     */
    IF @readStatus NOT IN ('lida', 'descartada')
    BEGIN
        ;THROW 51000, 'InvalidReadStatus', 1;
    END

    DECLARE @currentStatus NVARCHAR(50);

    SELECT @currentStatus = [readStatus]
    FROM [functional].[notification]
    WHERE [idNotification] = @idNotification
      AND [idAccount] = @idAccount
      AND [idUser] = @idUser
      AND [deleted] = 0;

    /**
     * @validation Ensure the notification exists and belongs to the user.
     * @throw {NotificationNotFound}
     */
    IF @currentStatus IS NULL
    BEGIN
        ;THROW 51000, 'NotificationNotFound', 1;
    END

    BEGIN TRY
        UPDATE [functional].[notification]
        SET 
            [readStatus] = @readStatus,
            [dateRead] = CASE WHEN @readStatus = 'lida' AND @currentStatus <> 'lida' THEN GETUTCDATE() ELSE [dateRead] END
        WHERE [idNotification] = @idNotification
          AND [idAccount] = @idAccount
          AND [idUser] = @idUser;

        SELECT CAST(1 AS BIT) AS [success];
    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END;
GO