/**
 * @schema subscription
 * Contains tables for managing accounts (tenants), subscriptions, and billing.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'subscription')
BEGIN
    EXEC('CREATE SCHEMA subscription');
END
GO

-- The 'account' table is fundamental for multi-tenancy.
/*
CREATE TABLE [subscription].[account] (
    [idAccount] INTEGER IDENTITY(1,1) NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [deleted] BIT NOT NULL DEFAULT (0)
);
*/
