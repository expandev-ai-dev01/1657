/**
 * @summary
 * Searches for tasks based on a variety of criteria, including a search term,
 * status, priority, category, and due date range. Supports sorting and pagination.
 *
 * @procedure spTaskSearch
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/search
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID to search tasks within.
 * @param {NVARCHAR(100)} searchTerm
 *   - Required: No
 *   - Description: A term to search in task titles, descriptions, and category names.
 * @param {TINYINT} statusFilter
 *   - Required: No
 *   - Description: Filter by completion status (0=pending, 1=completed).
 * @param {TINYINT} priorityFilter
 *   - Required: No
 *   - Description: Filter by priority (0=Low, 1=Medium, 2=High).
 * @param {INT} idCategoryFilter
 *   - Required: No
 *   - Description: Filter by a specific category ID.
 * @param {DATE} dueDateStart
 *   - Required: No
 *   - Description: The start of the due date range filter.
 * @param {DATE} dueDateEnd
 *   - Required: No
 *   - Description: The end of the due date range filter.
 * @param {NVARCHAR(20)} sortBy
 *   - Required: No
 *   - Description: The field to sort by ('relevance', 'dateCreated', 'dueDate', 'priority').
 * @param {NVARCHAR(4)} sortDirection
 *   - Required: No
 *   - Description: The direction to sort ('ASC' or 'DESC').
 * @param {INT} pageNumber
 *   - Required: No
 *   - Description: The page number for pagination.
 * @param {INT} pageSize
 *   - Required: No
 *   - Description: The number of results per page.
 *
 * @returns {Task[], n, n} The first result set contains the paginated list of tasks.
 * @returns {TotalCount, 1, 1} The second result set contains the total count of matching tasks.
 *
 * @testScenarios
 * - Search with a simple term.
 * - Search and filter by status and priority.
 * - Search and sort by due date.
 * - Retrieve a specific page of results.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskSearch]
    @idAccount INT,
    @searchTerm NVARCHAR(100) = NULL,
    @statusFilter TINYINT = NULL, -- 0: pending, 1: completed
    @priorityFilter TINYINT = NULL, -- 0: low, 1: medium, 2: high
    @idCategoryFilter INT = NULL,
    @dueDateStart DATE = NULL,
    @dueDateEnd DATE = NULL,
    @sortBy NVARCHAR(20) = 'relevance',
    @sortDirection NVARCHAR(4) = 'DESC',
    @pageNumber INT = 1,
    @pageSize INT = 20
AS
BEGIN
    SET NOCOUNT ON;

    -- Parameter validation
    IF @pageNumber < 1 SET @pageNumber = 1;
    IF @pageSize < 1 OR @pageSize > 100 SET @pageSize = 20;
    IF @sortDirection NOT IN ('ASC', 'DESC') SET @sortDirection = 'DESC';
    IF @sortBy NOT IN ('relevance', 'dateCreated', 'dueDate', 'priority') SET @sortBy = 'relevance';

    DECLARE @offset INT = (@pageNumber - 1) * @pageSize;

    -- Sanitize search term for LIKE
    IF @searchTerm IS NOT NULL
        SET @searchTerm = '%' + @searchTerm + '%';

    -- CTE to get filtered results and calculate relevance score
    WITH [FilteredTasks] AS (
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
            [tsk].[completed],
            [tsk].[dateCreated],
            [tsk].[dateModified],
            (CASE WHEN @searchTerm IS NOT NULL AND [tsk].[title] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI THEN 2 ELSE 0 END) +
            (CASE WHEN @searchTerm IS NOT NULL AND [tsk].[description] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI THEN 1 ELSE 0 END) AS [relevanceScore]
        FROM [functional].[task] [tsk]
        LEFT JOIN [functional].[category] [cat] ON [cat].[idCategory] = [tsk].[idCategory] AND [cat].[idAccount] = [tsk].[idAccount]
        WHERE
            [tsk].[idAccount] = @idAccount
            AND [tsk].[deleted] = 0
            AND (@searchTerm IS NULL OR
                 [tsk].[title] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI OR
                 [tsk].[description] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI OR
                 [cat].[name] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI)
            AND (@statusFilter IS NULL OR [tsk].[completed] = @statusFilter)
            AND (@priorityFilter IS NULL OR [tsk].[priority] = @priorityFilter)
            AND (@idCategoryFilter IS NULL OR [tsk].[idCategory] = @idCategoryFilter)
            AND (@dueDateStart IS NULL OR [tsk].[dueDate] >= @dueDateStart)
            AND (@dueDateEnd IS NULL OR [tsk].[dueDate] <= @dueDateEnd)
    )
    -- Main query for pagination and final result set
    SELECT
        [ft].*
    FROM [FilteredTasks] [ft]
    ORDER BY
        CASE WHEN @sortBy = 'relevance' AND @sortDirection = 'DESC' THEN [ft].[relevanceScore] END DESC,
        CASE WHEN @sortBy = 'dateCreated' AND @sortDirection = 'ASC' THEN [ft].[dateCreated] END ASC,
        CASE WHEN @sortBy = 'dateCreated' AND @sortDirection = 'DESC' THEN [ft].[dateCreated] END DESC,
        CASE WHEN @sortBy = 'dueDate' AND @sortDirection = 'ASC' THEN [ft].[dueDate] END ASC,
        CASE WHEN @sortBy = 'dueDate' AND @sortDirection = 'DESC' THEN [ft].[dueDate] END DESC,
        CASE WHEN @sortBy = 'priority' AND @sortDirection = 'ASC' THEN [ft].[priority] END ASC,
        CASE WHEN @sortBy = 'priority' AND @sortDirection = 'DESC' THEN [ft].[priority] END DESC,
        [ft].[idTask] DESC -- Default fallback sort
    OFFSET @offset ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    -- Second result set for total count
    SELECT COUNT(*) AS [totalCount]
    FROM [functional].[task] [tsk]
    LEFT JOIN [functional].[category] [cat] ON [cat].[idCategory] = [tsk].[idCategory] AND [cat].[idAccount] = [tsk].[idAccount]
    WHERE
        [tsk].[idAccount] = @idAccount
        AND [tsk].[deleted] = 0
        AND (@searchTerm IS NULL OR
             [tsk].[title] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI OR
             [tsk].[description] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI OR
             [cat].[name] LIKE @searchTerm COLLATE SQL_Latin1_General_CP1_CI_AI)
        AND (@statusFilter IS NULL OR [tsk].[completed] = @statusFilter)
        AND (@priorityFilter IS NULL OR [tsk].[priority] = @priorityFilter)
        AND (@idCategoryFilter IS NULL OR [tsk].[idCategory] = @idCategoryFilter)
        AND (@dueDateStart IS NULL OR [tsk].[dueDate] >= @dueDateStart)
        AND (@dueDateEnd IS NULL OR [tsk].[dueDate] <= @dueDateEnd);

END;
GO