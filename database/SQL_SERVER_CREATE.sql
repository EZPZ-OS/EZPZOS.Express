SET ANSI_NULLS ON
go
SET QUOTED_IDENTIFIER ON
go

SET ANSI_PADDING ON
go

SET ANSI_WARNINGS ON
go

ALTER LOGIN sa WITH PASSWORD='EZPZOSAdmin!', 
CHECK_POLICY=OFF
GO

ALTER LOGIN sa ENABLE
GO

EXEC sys.sp_configure N'remote access', N'1'
GO

RECONFIGURE WITH OVERRIDE
GO


IF (NOT EXISTS (SELECT [name]
FROM [master].[sys].[databases] 
WHERE [name]= N'EZPZOS'))
Begin

Create Database [EZPZOS]
ALTER DATABASE [EZPZOS] SET RECOVERY SIMPLE

END;
GO

IF (EXISTS (SELECT [name]
FROM [master].[sys].[databases] 
WHERE [name]= N'EZPZOS'))
Begin
use [EZPZOS];
End;

Go

IF(NOT EXISTS (SELECT * 
FROM INFORMATION_SCHEMA.TABLES 
WHERE  TABLE_NAME = 'User'))

Begin

Create Table [dbo].[User](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[Username] NVARCHAR(255) NOT NULL,
	[Password] NVARCHAR(200) NOT NULL,
	[Salt] NVARCHAR(200) NOT NULL,
	[Email] NVARCHAR(255) NOT NULL,
	[Mobile] NVARCHAR(50) NOT NULL,
	[Avatar] Image NOT NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL,
)

ALTER TABLE  [dbo].[User]
ADD CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)


CREATE UNIQUE NONCLUSTERED INDEX [Username] ON [dbo].[User] ([Username] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)


CREATE UNIQUE NONCLUSTERED INDEX [Email] ON [dbo].[User] ([Email] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE UNIQUE NONCLUSTERED INDEX [Mobile] ON [dbo].[User] ([Mobile] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)


Create Table [dbo].[Role](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[Code] Int NOT NULL,
	[Description] NVARCHAR(500) NOT NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[Role]
ADD CONSTRAINT [PK_Role] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [Code] ON [dbo].[Role] ([Code] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

Create Table [dbo].[UserRole](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[RoleId] UNIQUEIDENTIFIER NOT NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)


ALTER TABLE  [dbo].[UserRole]
ADD CONSTRAINT [PK_UserRole] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_UserRole_User' and type='F')
ALTER TABLE [dbo].[UserRole] WITH NOCHECK
      ADD CONSTRAINT [Relation_UserRole_User] FOREIGN KEY
          ( [UserId] )
          REFERENCES [dbo].[User]
          ( [Id] )

IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_UserRole_Role' and type='F')
ALTER TABLE [dbo].[UserRole] WITH NOCHECK
      ADD CONSTRAINT [Relation_UserRole_Role] FOREIGN KEY
          ( [RoleId] )
          REFERENCES [dbo].[Role]
          ( [Id] )

Create Table [dbo].[Event](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[EventCode] int NOT NULL,
	[EventTime] datetime NOT NULL,
	[ParentId] UNIQUEIDENTIFIER NOT NULL,
	[ParentTable] NVARCHAR(255) NOT NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[Event]
ADD CONSTRAINT [PK_Event] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [EventCode] ON [dbo].[Event] ([EventCode] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [EventTime] ON [dbo].[Event] ([EventTime] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [ParentId] ON [dbo].[Event] ([ParentId] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

-- OTP
CREATE TABLE [dbo].[OTP]
	(
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[Mobile] NVARCHAR(20) NOT NULL,
	[OTP] NVARCHAR(6) NOT NULL,
	[ExpiresAt] DATETIME NOT NULL
	);

-- Index
ALTER TABLE  [dbo].[OTP]
ADD CONSTRAINT [PK_OTP] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [IX_OTPs_Mobile] ON [dbo].[OTP] ([Mobile] ASC)
WITH (FILLFACTOR = 50, IGNORE_DUP_KEY = OFF);

End;
go