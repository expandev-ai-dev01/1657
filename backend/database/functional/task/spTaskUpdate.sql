/**
 * @summary
 * Updates an existing task, including priority changes.
 *
 * @procedure spTaskUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID for multi-tenancy validation.
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: The ID of the task to update.
 * @param {NVARCHAR(255)} title
 *   - Required: No
 *   - Description: Updated task title.
 * @param {NVARCHAR(2000)} description
 *   - Required: No
 *   - Description: Updated task description.
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: Updated due date.
 * @param {TINYINT} priority
 *   - Required: No
 *   - Description: Updated priority level (0=Low, 1=Medium, 2=High).
 * @param {INT} idCategory
 *   - Required: No
 *   - Description: Updated category ID.
 * @param {INT} idUserResponsible
 *   - Required: No
 *   - Description: Updated responsible user ID.
 *
 * @returns {Task, 1, n} The updated task record.
 *
 * @testScenarios
 * - Update only the priority of a task.
 * - Update multiple fields including priority.
 * - Attempt to update a task with an invalid priority.
 * - Attempt to update a task that does not exist.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskUpdate]
    @idAccount INT,
    @idTask INT,
    @title NVARCHAR(255) = NULL,
    @description NVARCHAR(2000) = NULL,
    @dueDate DATE = NULL,
    @priority TINYINT = NULL,
    @idCategory INT = NULL,
    @idUserResponsible INT = NULL
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
     * @validation Ensure due date is not in the past.
     * @throw {DueDateCannotBeInThePast}
     */
    IF @dueDate IS NOT NULL AND @dueDate < @currentDate
    BEGIN
        ;THROW 51000, 'DueDateCannotBeInThePast', 1;
    END

    /**
     * @validation Ensure title is not empty if provided.
     * @throw {TitleCannotBeEmpty}
     */
    IF @title IS NOT NULL AND LTRIM(RTRIM(@title)) = ''
    BEGIN
        ;THROW 51000, 'TitleCannotBeEmpty', 1;
    END

    BEGIN TRY
        UPDATE [functional].[task]
        SET
            [title] = ISNULL(@title, [title]),
            [description] = ISNULL(@description, [description]),
            [dueDate] = ISNULL(@dueDate, [dueDate]),
            [priority] = ISNULL(@priority, [priority]),
            [idCategory] = ISNULL(@idCategory, [idCategory]),
            [idUserResponsible] = ISNULL(@idUserResponsible, [idUserResponsible])
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
         * @column {TINYINT} priority - Task priority level
         * @column {DATETIME2} dateCreated - Task creation date
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
            [tsk].[priority],
            [tsk].[dateCreated]
        FROM [functional].[task] [tsk]
        WHERE [tsk].[idTask] = @idTask
            AND [tsk].[idAccount] = @idAccount;
    END TRY
    BEGIN CATCH
        ;THROW;
    END CATCH
END;
GO
