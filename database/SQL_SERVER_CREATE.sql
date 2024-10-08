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

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Code] INT NOT NULL,
    [Description] NVARCHAR(500),
    [IsDeleted] BIT NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [CreatedUserId] UNIQUEIDENTIFIER,
    [UpdatedTimestamp] DATETIME,
    [UpdatedUserId] UNIQUEIDENTIFIER,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Username] NVARCHAR(500) NOT NULL,
    [Password] NVARCHAR(500) NOT NULL,
    [Salt] NVARCHAR(500) NOT NULL,
    [Email] NVARCHAR(500) NOT NULL,
    [Mobile] NVARCHAR(500) NOT NULL,
    [Avatar] IMAGE,
    [IsDeleted] BIT NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [CreatedUserId] UNIQUEIDENTIFIER,
    [UpdatedTimestamp] DATETIME,
    [UpdatedUserId] UNIQUEIDENTIFIER,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[UserRole] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [RoleId] UNIQUEIDENTIFIER NOT NULL,
    [IsDeleted] BIT NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [CreatedUserId] UNIQUEIDENTIFIER,
    [UpdatedTimestamp] DATETIME,
    [UpdatedUserId] UNIQUEIDENTIFIER,
    CONSTRAINT [UserRole_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[HotSale] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [SaleTimestamp] DATETIME NOT NULL,
    [ExpiryTimestamp] DATETIME NOT NULL,
    [ReductionRequired] FLOAT(53) NOT NULL,
    [Reduction] FLOAT(53) NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [HotSale_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Cuisine] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Name] NVARCHAR(500) NOT NULL,
    [Description] NVARCHAR(500) NOT NULL,
    [Price] FLOAT(53) NOT NULL,
    [Image] NVARCHAR(MAX) NOT NULL,
    [Category] NVARCHAR(500) NOT NULL,
    [IsAvailable] BIT NOT NULL,
    [EstimatedTime] INT NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [Cuisine_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[CuisineHotSale] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Category] NVARCHAR(500) NOT NULL,
    [Discount] FLOAT(53) NOT NULL,
    [CuisineId] UNIQUEIDENTIFIER NOT NULL,
    [HotSaleId] UNIQUEIDENTIFIER NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [CuisineHotSale_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[OrderItem] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Quantity] INT NOT NULL,
    [OrderItemType] NVARCHAR(1000) NOT NULL,
    [CuisineId] UNIQUEIDENTIFIER NOT NULL,
    [OrderId] UNIQUEIDENTIFIER NOT NULL,
    [Comments] NVARCHAR(500),
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [OrderItem_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [TableNumber] NVARCHAR(500) NOT NULL,
    [PaymentOption] NVARCHAR(1000) NOT NULL,
    [CompletedTimestamp] DATETIME,
    [PickupTimestamp] DATETIME,
    [IsPaid] BIT NOT NULL,
    [BranchId] UNIQUEIDENTIFIER NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_Email_key] UNIQUE NONCLUSTERED ([Email]);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_Mobile_key] UNIQUE NONCLUSTERED ([Mobile]);

END;
go