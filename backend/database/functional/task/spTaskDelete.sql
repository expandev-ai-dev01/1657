/**
 * @summary
 * Soft deletes a task by setting the deleted flag.
 *
 * @procedure spTaskDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID for multi-tenancy validation.
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: The ID of the task to delete.
 *
 * @returns {BIT} 1 if deletion was successful, 0 otherwise.
 *
 * @testScenarios
 * - Delete an existing task.
 * - Attempt to delete a task that does not exist.
 * - Attempt to delete a task from a different account.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskDelete]
    @idAccount INT,
    @idTask INT
AS
BEGIN
    SET NOCOUNT ON;

    /**
     * @validation Ensure account ID and task ID are valid.
     * @throw {InvalidParameters}
     */
    IF @idAccount IS NULL OR @idAccount <= 0 OR @idTask IS NULL OR @idTask <= 0
    BEGIN
        ;THROW 51000, 'InvalidParameters', 1;
    END

    /**
     * @validation Ensure task exists and belongs to the account.
     * @throw {TaskNotFound}
     */
    IF NOT EXISTS (SELECT 1 FROM [functional].[task] WHERE [idTask] = @idTask AND [idAccount] = @idAccount AND [deleted] = 0)
    BEGIN
        ;THROW 51000, 'TaskNotFound', 1;
    END

    BEGIN TRY
        UPDATE [functional].[task]
        SET [deleted] = 1
        WHERE [idTask] = @idTask
            AND [idAccount] = @idAccount;

        SELECT CAST(1 AS BIT) AS [success];
    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END;
GO
