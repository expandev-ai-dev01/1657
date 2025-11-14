/**
 * @schema functional
 * Contains tables related to the core business logic and entities of the application.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'functional')
BEGIN
    EXEC('CREATE SCHEMA functional');
END
GO

-- Feature-specific tables (e.g., tasks, categories) will be defined here.

/**
 * @table category Stores user-defined categories for tasks.
 * @multitenancy true
 * @softDelete true
 * @alias cat
 */
CREATE TABLE [functional].[category] (
  [idCategory] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL
);
GO

/**
 * @table task Stores user tasks with details like title, due date, and priority.
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idCategory] INTEGER NULL,
  [idUserCreator] INTEGER NOT NULL,
  [idUserResponsible] INTEGER NOT NULL,
  [title] NVARCHAR(255) NOT NULL,
  [description] NVARCHAR(2000) NULL,
  [dueDate] DATE NULL,
  [dueTime] TIME NULL,
  [priority] TINYINT NOT NULL,
  [completed] BIT NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL
);
GO

-- Constraints for functional.category

/**
 * @primaryKey pkCategory
 * @keyType Object
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [pkCategory] PRIMARY KEY CLUSTERED ([idCategory]);
GO

/**
 * @default dfCategory_DateCreated Sets the creation date to the current UTC timestamp.
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [dfCategory_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @default dfCategory_DateModified Sets the modification date to the current UTC timestamp.
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [dfCategory_DateModified] DEFAULT (GETUTCDATE()) FOR [dateModified];
GO

/**
 * @default dfCategory_Deleted Sets the default deleted status to false (0).
 */
ALTER TABLE [functional].[category]
ADD CONSTRAINT [dfCategory_Deleted] DEFAULT (0) FOR [deleted];
GO

/**
 * @index uqCategory_Account_Name Ensures category names are unique per account.
 * @type Unique
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqCategory_Account_Name]
ON [functional].[category]([idAccount], [name])
WHERE [deleted] = 0;
GO

-- Constraints for functional.task

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

/**
 * @foreignKey fkTask_Account Links task to an account for multi-tenancy.
 * @target subscription.account
 */
-- ALTER TABLE [functional].[task]
-- ADD CONSTRAINT [fkTask_Account] FOREIGN KEY ([idAccount])
-- REFERENCES [subscription].[account]([idAccount]);
-- GO

/**
 * @foreignKey fkTask_Category Links task to a category.
 * @target functional.category
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [fkTask_Category] FOREIGN KEY ([idCategory])
REFERENCES [functional].[category]([idCategory]);
GO

/**
 * @foreignKey fkTask_UserCreator Links task to the user who created it.
 * @target security.user
 */
-- ALTER TABLE [functional].[task]
-- ADD CONSTRAINT [fkTask_UserCreator] FOREIGN KEY ([idUserCreator])
-- REFERENCES [security].[user]([idUser]);
-- GO

/**
 * @foreignKey fkTask_UserResponsible Links task to the user responsible for it.
 * @target security.user
 */
-- ALTER TABLE [functional].[task]
-- ADD CONSTRAINT [fkTask_UserResponsible] FOREIGN KEY ([idUserResponsible])
-- REFERENCES [security].[user]([idUser]);
-- GO

/**
 * @check chkTask_Priority Ensures priority is within the valid range (0=Low, 1=Medium, 2=High).
 * @enum {0} Low
 * @enum {1} Medium
 * @enum {2} High
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_Priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @default dfTask_Priority Sets the default priority to Medium (1).
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_Priority] DEFAULT (1) FOR [priority];
GO

/**
 * @default dfTask_Completed Sets the default completed status to false (0).
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_Completed] DEFAULT (0) FOR [completed];
GO

/**
 * @default dfTask_DateCreated Sets the creation date to the current UTC timestamp.
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_DateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

/**
 * @default dfTask_DateModified Sets the modification date to the current UTC timestamp.
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_DateModified] DEFAULT (GETUTCDATE()) FOR [dateModified];
GO

/**
 * @default dfTask_Deleted Sets the default deleted status to false (0).
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_Deleted] DEFAULT (0) FOR [deleted];
GO

-- Indexes for functional.task

/**
 * @index ixTask_Account Optimizes queries filtered by account.
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_DueDate Optimizes queries filtered or sorted by due date.
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_DueDate]
ON [functional].[task]([idAccount], [dueDate])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_UserResponsible Optimizes queries to find tasks for a specific user.
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_UserResponsible]
ON [functional].[task]([idAccount], [idUserResponsible])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Priority Optimizes queries filtered or sorted by priority.
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixTask_Priority]
ON [functional].[task]([idAccount], [priority])
WHERE [deleted] = 0;
GO
