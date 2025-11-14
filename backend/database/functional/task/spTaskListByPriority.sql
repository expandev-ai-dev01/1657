/**
 * @summary
 * Retrieves tasks grouped and sorted by priority level with optional filtering.
 *
 * @procedure spTaskListByPriority
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/priority/list
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID to retrieve tasks for.
 * @param {NVARCHAR(20)} sortOrder
 *   - Required: No
 *   - Description: Sort order for priority ('ASC' for ascending, 'DESC' for descending). Default 'DESC'.
 * @param {BIT} groupByPriority
 *   - Required: No
 *   - Description: If 1, group tasks by priority level. Default 0.
 * @param {NVARCHAR(50)} secondarySortCriteria
 *   - Required: No
 *   - Description: Secondary sort criteria ('dueDate', 'dateCreated', 'title'). Default 'dueDate'.
 *
 * @returns {TasksByPriority, n, n} Tasks organized by priority.
 *
 * @testScenarios
 * - Retrieve tasks sorted by priority in descending order.
 * - Retrieve tasks grouped by priority level.
 * - Apply secondary sorting by due date.
 * - Apply secondary sorting by creation date.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskListByPriority]
    @idAccount INT,
    @sortOrder NVARCHAR(20) = 'DESC',
    @groupByPriority BIT = 0,
    @secondarySortCriteria NVARCHAR(50) = 'dueDate'
AS
BEGIN
    SET NOCOUNT ON;

    /**
     * @validation Ensure account ID is valid.
     * @throw {AccountIdRequired}
     */
    IF @idAccount IS NULL OR @idAccount <= 0
    BEGIN
        ;THROW 51000, 'AccountIdRequired', 1;
    END

    /**
     * @validation Ensure sort order is valid.
     * @throw {InvalidSortOrder}
     */
    IF @sortOrder NOT IN ('ASC', 'DESC')
    BEGIN
        SET @sortOrder = 'DESC';
    END

    /**
     * @validation Ensure secondary sort criteria is valid.
     * @throw {InvalidSecondarySortCriteria}
     */
    IF @secondarySortCriteria NOT IN ('dueDate', 'dateCreated', 'title')
    BEGIN
        SET @secondarySortCriteria = 'dueDate';
    END

    /**
     * @output {TasksByPriority, n, n}
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
     * @column {NVARCHAR} priorityLabel - Human-readable priority label
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
        [tsk].[dateCreated],
        CASE
            WHEN [tsk].[priority] = 0 THEN 'Baixa'
            WHEN [tsk].[priority] = 1 THEN 'Média'
            WHEN [tsk].[priority] = 2 THEN 'Alta'
            ELSE 'Desconhecida'
        END AS [priorityLabel]
    FROM [functional].[task] [tsk]
    WHERE [tsk].[idAccount] = @idAccount
        AND [tsk].[deleted] = 0
    ORDER BY
        CASE WHEN @sortOrder = 'ASC' THEN [tsk].[priority] END ASC,
        CASE WHEN @sortOrder = 'DESC' THEN [tsk].[priority] END DESC,
        CASE
            WHEN @secondarySortCriteria = 'dueDate' THEN CAST([tsk].[dueDate] AS NVARCHAR(MAX))
            WHEN @secondarySortCriteria = 'dateCreated' THEN CAST([tsk].[dateCreated] AS NVARCHAR(MAX))
            WHEN @secondarySortCriteria = 'title' THEN [tsk].[title]
            ELSE CAST([tsk].[dueDate] AS NVARCHAR(MAX))
        END ASC;
END;
GO
