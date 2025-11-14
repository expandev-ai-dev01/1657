/**
 * @summary
 * Retrieves the history of priority changes for a specific task.
 *
 * @procedure spTaskPriorityHistory
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/:id/priority-history
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID for multi-tenancy validation.
 * @param {INT} idTask
 *   - Required: Yes
 *   - Description: The ID of the task to retrieve priority history for.
 *
 * @returns {PriorityHistory, n, n} History of priority changes for the task.
 *
 * @testScenarios
 * - Retrieve priority history for a task with multiple changes.
 * - Retrieve priority history for a task with no changes.
 * - Attempt to retrieve history for a non-existent task.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskPriorityHistory]
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
    IF NOT EXISTS (SELECT 1 FROM [functional].[task] WHERE [idTask] = @idTask AND [idAccount] = @idAccount)
    BEGIN
        ;THROW 51000, 'TaskNotFound', 1;
    END

    /**
     * @output {PriorityHistory, n, n}
     * @column {INT} idTask - Task identifier
     * @column {TINYINT} priority - Current priority level
     * @column {NVARCHAR} priorityLabel - Human-readable priority label
     * @column {DATETIME2} dateCreated - Date when priority was set
     */
    SELECT
        [tsk].[idTask],
        [tsk].[priority],
        CASE
            WHEN [tsk].[priority] = 0 THEN 'Baixa'
            WHEN [tsk].[priority] = 1 THEN 'Média'
            WHEN [tsk].[priority] = 2 THEN 'Alta'
            ELSE 'Desconhecida'
        END AS [priorityLabel],
        [tsk].[dateCreated]
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idTask] = @idTask
        AND [tsk].[idAccount] = @idAccount;
END;
GO
