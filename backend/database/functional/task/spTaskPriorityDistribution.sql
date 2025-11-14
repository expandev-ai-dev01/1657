/**
 * @summary
 * Generates a report showing the distribution of tasks by priority level.
 *
 * @procedure spTaskPriorityDistribution
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/task/reports/priority-distribution
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: The account ID to generate the report for.
 * @param {DATE} startDate
 *   - Required: No
 *   - Description: Start date for filtering tasks. NULL for no filter.
 * @param {DATE} endDate
 *   - Required: No
 *   - Description: End date for filtering tasks. NULL for no filter.
 *
 * @returns {PriorityDistribution, 1, n} Distribution of tasks by priority.
 *
 * @testScenarios
 * - Generate distribution report for all tasks.
 * - Generate distribution report for a specific date range.
 * - Generate distribution report when no tasks exist.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskPriorityDistribution]
    @idAccount INT,
    @startDate DATE = NULL,
    @endDate DATE = NULL
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
     * @output {PriorityDistribution, 1, n}
     * @column {TINYINT} priority - Priority level (0=Low, 1=Medium, 2=High)
     * @column {NVARCHAR} priorityLabel - Human-readable priority label
     * @column {INT} taskCount - Number of tasks at this priority level
     * @column {NUMERIC} percentage - Percentage of total tasks
     */
    WITH [PriorityStats] AS (
        SELECT
            [priority],
            COUNT(*) AS [taskCount]
        FROM [functional].[task]
        WHERE [idAccount] = @idAccount
            AND [deleted] = 0
            AND (@startDate IS NULL OR [dateCreated] >= @startDate)
            AND (@endDate IS NULL OR [dateCreated] <= @endDate)
        GROUP BY [priority]
    )
    SELECT
        [ps].[priority],
        CASE
            WHEN [ps].[priority] = 0 THEN 'Baixa'
            WHEN [ps].[priority] = 1 THEN 'Média'
            WHEN [ps].[priority] = 2 THEN 'Alta'
            ELSE 'Desconhecida'
        END AS [priorityLabel],
        [ps].[taskCount],
        CAST(([ps].[taskCount] * 100.0) / (SELECT SUM([taskCount]) FROM [PriorityStats]) AS NUMERIC(5, 2)) AS [percentage]
    FROM [PriorityStats] [ps]
    ORDER BY [ps].[priority];
END;
GO
