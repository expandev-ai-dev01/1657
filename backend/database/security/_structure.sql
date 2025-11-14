/**
 * @schema security
 * Contains tables for authentication, authorization, users, roles, and permissions.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'security')
BEGIN
    EXEC('CREATE SCHEMA security');
END
GO

-- User, Role, Permission, and other security-related tables will be defined here.
