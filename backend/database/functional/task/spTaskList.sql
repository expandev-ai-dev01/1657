/**
 * @summary
 * Retrieves a list of tasks for a given account with optional filtering and sorting by priority.
 *
 * @procedure spTaskList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID to retrieve tasks for.
 * @param {TINYINT} priorityFilter
 *   - Required: No
 *   - Description: Filter tasks by priority (0=Low, 1=Medium, 2=High). NULL for no filter.
 * @param {NVARCHAR(20)} sortOrder
 *   - Required: No
 *   - Description: Sort order for priority ('ASC' for ascending, 'DESC' for descending). Default 'DESC'.
 * @param {INT} pageNumber
 *   - Required: No
 *   - Description: Page number for pagination. Default 1.
 * @param {INT} pageSize
 *   - Required: No
 *   - Description: Number of records per page. Default 50.
 *
 * @returns {TaskList, n, n} List of tasks matching the criteria.
 *
 * @testScenarios
 * - Retrieve all tasks for an account.
 * - Filter tasks by a specific priority level.
 * - Sort tasks by priority in ascending and descending order.
 * - Retrieve paginated results.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskList]
    @idAccount INT,
    @priorityFilter TINYINT = NULL,
    @sortOrder NVARCHAR(20) = 'DESC',
    @pageNumber INT = 1,
    @pageSize INT = 50
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
     * @validation Ensure page number and page size are valid.
     * @throw {InvalidPaginationParameters}
     */
    IF @pageNumber < 1
        SET @pageNumber = 1;
    IF @pageSize < 1 OR @pageSize > 500
        SET @pageSize = 50;

    DECLARE @offset INT = (@pageNumber - 1) * @pageSize;

    /**
     * @output {TaskList, n, n}
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
        AND [tsk].[deleted] = 0
        AND (@priorityFilter IS NULL OR [tsk].[priority] = @priorityFilter)
    ORDER BY
        CASE WHEN @sortOrder = 'ASC' THEN [tsk].[priority] END ASC,
        CASE WHEN @sortOrder = 'DESC' THEN [tsk].[priority] END DESC,
        [tsk].[dueDate] ASC,
        [tsk].[dateCreated] DESC
    OFFSET @offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END;
GO
