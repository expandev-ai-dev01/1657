/**
 * @summary
 * Removes the due date and due time from a task.
 *
 * @procedure spTaskRemoveDueDate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/task/:id/due-date
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID for multi-tenancy validation.
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: The ID of the task to remove the due date from.
 *
 * @returns {Task, 1, n} The updated task record.
 *
 * @testScenarios
 * - Remove due date from a task that has one.
 * - Attempt to remove due date from a task that does not have one.
 * - Attempt to remove due date from a task that does not exist.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskRemoveDueDate]
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
        /**
         * @rule {BR-008} When removing due date, also remove due time.
         */
        UPDATE [functional].[task]
        SET
            [dueDate] = NULL,
            [dueTime] = NULL,
            [dateModified] = GETUTCDATE()
        WHERE [idTask] = @idTask
            AND [idAccount] = @idAccount
            AND [deleted] = 0;

        /**
         * @output {Task, 1, n}
         * @column {INT} idTask - Task identifier
         * @column {INT} idAccount - Account identifier
         * @column {INT} idCategory - Category identifier
         * @column {INT} idUserCreator - Creator user identifier
         * @column {INT} idUserResponsible - Responsible user identifier
         * @column {NVARCHAR} title - Task title
         * @column {NVARCHAR} description - Task description
         * @column {DATE} dueDate - Task due date
         * @column {TIME} dueTime - Task due time
         * @column {TINYINT} priority - Task priority level
         * @column {DATETIME2} dateCreated - Task creation date
         * @column {DATETIME2} dateModified - Task modification date
         */
        SELECT
            [tsk].[idTask],
            [tsk].[idAccount],
            [tsk].[idCategory],
            [tsk].[idUserCreator],
            [tsk].[idUserResponsible],
            [tsk].[title],
            [tsk].[description],
            [tsk].[dueDate],
            [tsk].[dueTime],
            [tsk].[priority],
            [tsk].[dateCreated],
            [tsk].[dateModified]
        FROM [functional].[task] [tsk]
        WHERE [tsk].[idTask] = @idTask
            AND [tsk].[idAccount] = @idAccount;
    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END;
GO
