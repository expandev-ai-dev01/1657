/**
 * @summary
 * Retrieves a single task by ID with all its details.
 *
 * @procedure spTaskGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID for multi-tenancy validation.
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: The ID of the task to retrieve.
 *
 * @returns {Task, 1, n} The task record if found.
 *
 * @testScenarios
 * - Retrieve an existing task.
 * - Attempt to retrieve a task that does not exist.
 * - Attempt to retrieve a task from a different account.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskGet]
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
    WHERE [tsk].[idAccount] = @idAccount
        AND [tsk].[idTask] = @idTask
        AND [tsk].[deleted] = 0;
END;
GO
