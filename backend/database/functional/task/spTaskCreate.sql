/**
 * @summary
 * Creates a new task for a given account and user.
 * 
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - POST /api/v1/internal/task
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: The account under which the task is being created.
 * @param {INT} idUser 
 *   - Required: Yes
 *   - Description: The ID of the user creating the task.
 * @param {NVARCHAR(255)} title
 *   - Required: Yes
 *   - Description: The title of the task.
 * @param {NVARCHAR(2000)} description
 *   - Required: No
 *   - Description: A detailed description of the task.
 * @param {DATE} dueDate
 *   - Required: No
 *   - Description: The due date for the task.
 * @param {TINYINT} priority
 *   - Required: No
 *   - Description: Priority level (0=Low, 1=Medium, 2=High). Defaults to 1.
 * @param {INT} idCategory
 *   - Required: No
 *   - Description: The ID of the category this task belongs to.
 * @param {INT} idUserResponsible
 *   - Required: No
 *   - Description: The ID of the user responsible for the task. Defaults to the creator.
 * 
 * @returns {Task} The newly created task record.
 * 
 * @testScenarios
 * - Create a task with only the required fields.
 * - Create a task with all fields populated.
 * - Attempt to create a task with a due date in the past.
 * - Attempt to create a task with an invalid priority level.
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
    @idAccount INT,
    @idUser INT,
    @title NVARCHAR(255),
    @description NVARCHAR(2000) = NULL,
    @dueDate DATE = NULL,
    @priority TINYINT = 1, -- Default to Medium
    @idCategory INT = NULL,
    @idUserResponsible INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @currentDate DATE = GETUTCDATE();

    /**
     * @validation Ensure title is not empty.
     * @throw {TitleIsRequired}
     */
    IF @title IS NULL OR LTRIM(RTRIM(@title)) = ''
    BEGIN
        ;THROW 51000, 'TitleIsRequired', 1;
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
     * @rule {BR-006} If responsible user is not specified, assign the creator.
     */
    IF @idUserResponsible IS NULL
    BEGIN
        SET @idUserResponsible = @idUser;
    END

    BEGIN TRY
        INSERT INTO [functional].[task] (
            [idAccount],
            [idCategory],
            [idUserCreator],
            [idUserResponsible],
            [title],
            [description],
            [dueDate],
            [priority]
        )
        OUTPUT INSERTED.*
        VALUES (
            @idAccount,
            @idCategory,
            @idUser, -- Creator is the user executing the action
            @idUserResponsible,
            @title,
            @description,
            @dueDate,
            ISNULL(@priority, 1) -- Default to Medium if NULL is passed
        );
    END TRY
    BEGIN CATCH
        -- Re-throw the original error to be caught by the application
        ;THROW;
    END CATCH
END;
GO
