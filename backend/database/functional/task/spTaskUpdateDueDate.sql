/**
 * @summary
 * Updates the due date and/or due time for an existing task.
 *
 * @procedure spTaskUpdateDueDate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PATCH /api/v1/internal/task/:id/due-date
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID for multi-tenancy validation.
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: The ID of the task to update.
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Updated due date. If NULL, the due date will be removed.
 * @param {TIME} dueTime
 *   - Required: No
 *   - Description: Updated due time. Only valid if dueDate is provided.
 *
 * @returns {Task, 1, n} The updated task record.
 *
 * @testScenarios
 * - Update only the due date of a task.
 * - Update both due date and due time.
 * - Remove the due date (set to NULL).
 * - Attempt to set due time without a due date.
 * - Attempt to update a task with a past due date.
 * - Attempt to update a task that does not exist.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdateDueDate]
    @idAccount INT,
    @idTask INT,
    @dueDate DATE = NULL,
    @dueTime TIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @currentDate DATE = GETUTCDATE();

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

    /**
     * @rule {BR-002} If due time is provided, due date must also be provided.
     * @throw {DueTimeRequiresDueDate}
     */
    IF @dueTime IS NOT NULL AND @dueDate IS NULL
    BEGIN
        ;THROW 51000, 'DueTimeRequiresDueDate', 1;
    END

    /**
     * @rule {BR-001} Due date cannot be in the past.
     * @throw {DueDateCannotBeInThePast}
     */
    IF @dueDate IS NOT NULL AND @dueDate < @currentDate
    BEGIN
        ;THROW 51000, 'DueDateCannotBeInThePast', 1;
    END

    /**
     * @rule {BR-004} Due date cannot be more than 100 years in the future.
     * @throw {DueDateTooFarInFuture}
     */
    IF @dueDate IS NOT NULL AND @dueDate > DATEADD(YEAR, 100, @currentDate)
    BEGIN
        ;THROW 51000, 'DueDateTooFarInFuture', 1;
    END

    /**
     * @rule {BR-008} When removing due date, also remove due time.
     */
    IF @dueDate IS NULL
    BEGIN
        SET @dueTime = NULL;
    END

    BEGIN TRY
        UPDATE [functional].[task]
        SET
            [dueDate] = @dueDate,
            [dueTime] = @dueTime,
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
