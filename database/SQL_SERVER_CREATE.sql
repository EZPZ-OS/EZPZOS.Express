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


-- UserRole - User Constraint
IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_UserRole_User' and type='F')
ALTER TABLE [dbo].[UserRole] WITH NOCHECK
      ADD CONSTRAINT [Relation_UserRole_User] FOREIGN KEY
          ( [UserId] )
          REFERENCES [dbo].[User]
          ( [Id] )

-- UserRole - Role Constraint
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
	[ParentTable] NVARCHAR(50) NOT NULL,
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


Create Table [dbo].[Voucher](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[ParentId] UNIQUEIDENTIFIER NOT NULL,
	[ParentTable] NVARCHAR(50) NOT NULL,
	[Code] NVARCHAR(255) NOT NULL,
	[Name] NVARCHAR(255) NOT NULL,
	[Description]  NVARCHAR(MAX) NULL,
	[Price] Float NOT NULL,
	[Discount] Float NOT NULL,
	[Type] NVARCHAR(50) NOT NULL,
	[ReductionRequired] Float NOT NULL,
	[EndTimestamp] datetime NOT NULL,
	[StartTimestamp] datetime NOT NULL,
	[ValidFromTimestamp] datetime NOT NULL,
	[ValidToTimestamp] datetime NOT NULL,
	[EffectiveTimeOfDayFrom] datetime NOT NULL,
	[EffectiveTimeOfDayTo] datetime NOT NULL,
	[ValidTimeofDayTo] datetime NOT NULL,
	[EffectiveDaysOfWeek] NVARCHAR(20) NOT NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[Voucher]
ADD CONSTRAINT [PK_Voucher] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [ParentId] ON [dbo].[Voucher] ([ParentId] ASC, [ParentTable] ASC, [Price] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [Code] ON [dbo].[Voucher] ([Code] ASC, [ParentTable] ASC, [Price] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)



Create Table [dbo].[Cuisine](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[Name] NVARCHAR(255) NOT NULL,
	[Description]  NVARCHAR(MAX) NULL,
	[Price] Float NOT NULL,
	[Catetory] NVARCHAR(50) NOT NULL,
	[Images] NVARCHAR(MAX) NULL,
	[IsAvailable] BIT NOT NULL,
	[EstimatedTime] datetime NULL,
	[ParentId] UNIQUEIDENTIFIER NULL,
	[ParentTable] NVARCHAR(50) NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[Cuisine]
ADD CONSTRAINT [PK_Cuisine] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [Name] ON [dbo].[Cuisine] ([Name] ASC, [Price] ASC, [IsAvailable] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [Catetory] ON [dbo].[Cuisine] ([Catetory] ASC, [Price] ASC, [IsAvailable] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [EstimatedTime] ON [dbo].[Cuisine] ([EstimatedTime] ASC, [Price] ASC, [IsAvailable] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [ParentId] ON [dbo].[Cuisine] ([ParentId] ASC, [ParentTable] ASC, [Price] ASC, [IsAvailable] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)


Create Table [dbo].[UserVoucher](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[VoucherId] UNIQUEIDENTIFIER NOT NULL,
	[OriginQuantity] Float NOT NULL,
	[ConsumedQuantity] Float NOT NULL,
	[IssuedTimestamp] datetime NULL,
	[ExpiryTimestamp] datetime NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[UserVoucher]
ADD CONSTRAINT [PK_UserVoucher] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)


CREATE NONCLUSTERED INDEX [UserId] ON [dbo].[UserVoucher] ([UserId] ASC, [IssuedTimestamp] ASC, [ExpiryTimestamp] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [VoucherId] ON [dbo].[UserVoucher] ([VoucherId] ASC, [IssuedTimestamp] ASC, [ExpiryTimestamp] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [OriginQuantity] ON [dbo].[UserVoucher] ([OriginQuantity] ASC, [ConsumedQuantity] ASC, [IssuedTimestamp] ASC, [ExpiryTimestamp] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

-- UserVoucher - User Constraint
IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_UserVoucher_User' and type='F')
ALTER TABLE [dbo].[UserVoucher] WITH NOCHECK
      ADD CONSTRAINT [Relation_UserVoucher_User] FOREIGN KEY
          ( [UserId] )
          REFERENCES [dbo].[User]
          ( [Id] )

-- UserVoucher - Voucher Constraint
IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_UserVoucher_Voucher' and type='F')
ALTER TABLE [dbo].[UserVoucher] WITH NOCHECK
      ADD CONSTRAINT [Relation_UserVoucher_Voucher] FOREIGN KEY
          ( [VoucherId] )
          REFERENCES [dbo].[Voucher]
          ( [Id] )


Create Table [dbo].[Order](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[UserId] UNIQUEIDENTIFIER NOT NULL,
	[UserVoucherId] UNIQUEIDENTIFIER NOT NULL,
	[TableNumber] NVARCHAR(10) NOT NULL,
	[PaymentOption] Int NOT NULL,
	[CompletedTimestamp] datetime NULL,
	[PickupTimestamp] datetime NULL,
	[IsPaid] BIT NOT NULL,
	[BranchId] UNIQUEIDENTIFIER NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[Order]
ADD CONSTRAINT [PK_Order] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)


CREATE NONCLUSTERED INDEX [UserId] ON [dbo].[Order] ([UserId] ASC, [CompletedTimestamp] ASC, [IsPaid] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [UserVoucherId] ON [dbo].[Order] ([UserVoucherId] ASC, [CompletedTimestamp] ASC, [IsPaid] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [PaymentOption] ON [dbo].[Order] ([PaymentOption] ASC, [CompletedTimestamp] ASC, [IsPaid] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [BranchId] ON [dbo].[Order] ([BranchId] ASC, [CompletedTimestamp] ASC, [IsPaid] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [TableNumber] ON [dbo].[Order] ([TableNumber] ASC, [CompletedTimestamp] ASC, [IsPaid] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)


-- Order - User Constraint
IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_Order_User' and type='F')
ALTER TABLE [dbo].[Order] WITH NOCHECK
      ADD CONSTRAINT [Relation_Order_User] FOREIGN KEY
          ( [UserId] )
          REFERENCES [dbo].[User]
          ( [Id] )

-- Order - UserVoucher Constraint
IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_Order_UserVoucher' and type='F')
ALTER TABLE [dbo].[Order] WITH NOCHECK
      ADD CONSTRAINT [Relation_Order_UserVoucher] FOREIGN KEY
          ( [UserVoucherId] )
          REFERENCES [dbo].[UserVoucher]
          ( [Id] )

-- //TODO Add Order - Branch Constrant


Create Table [dbo].[OrderItem](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[Quantity] int NOT NULL,
	[OrderItemType] Int NOT NULL,
	[CuisineId] UNIQUEIDENTIFIER NOT NULL,
	[OrderId] UNIQUEIDENTIFIER NOT NULL,
	[Comments] NVARCHAR(MAX) NOT NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[OrderItem]
ADD CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [CuisineId] ON [dbo].[OrderItem] ([CuisineId] ASC, [Quantity] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [OrderId] ON [dbo].[OrderItem] ([OrderId] ASC, [Quantity] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [OrderItemType] ON [dbo].[OrderItem] ([OrderItemType] ASC, [Quantity] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)


-- OrderItem - Order Constraints
IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_OrderItem_Order' and type='F')
ALTER TABLE [dbo].[OrderItem] WITH NOCHECK
      ADD CONSTRAINT [Relation_OrderItem_Order] FOREIGN KEY
          ( [OrderId] )
          REFERENCES [dbo].[Order]
          ( [Id] )

-- OrderItem - Cuisine Constraints
IF NOT EXISTS (SELECT 1 FROM sys.objects where name='Relation_OrderItem_Cuisine' and type='F')
ALTER TABLE [dbo].[OrderItem] WITH NOCHECK
      ADD CONSTRAINT [Relation_OrderItem_Cuisine] FOREIGN KEY
          ( [CuisineId] )
          REFERENCES [dbo].[Cuisine]
          ( [Id] )


Create Table [dbo].[Customisation](
	[Id] UNIQUEIDENTIFIER NOT NULL,
	[ParentId] UNIQUEIDENTIFIER NOT NULL,
	[ParentTable] NVARCHAR(50) NULL,
	[Name] NVARCHAR(255) NOT NULL,
	[Value] NVARCHAR(MAX) NOT NULL,
	[IsDeleted] BIT NOT NULL,
	[CreatedTimestamp] datetime NULL,
	[CreatedUserId] UNIQUEIDENTIFIER NULL,
	[UpdatedTimestamp] datetime NULL,
	[UpdatedUserId] UNIQUEIDENTIFIER NULL
)

ALTER TABLE  [dbo].[Customisation]
ADD CONSTRAINT [PK_Customisation] PRIMARY KEY CLUSTERED  ([Id] ASC)
WITH ( FILLFACTOR = 70, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [ParentId] ON [dbo].[Customisation] ([ParentId] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

CREATE NONCLUSTERED INDEX [Name] ON [dbo].[Customisation] ([Name] ASC)
WITH ( FILLFACTOR = 50, IGNORE_DUP_KEY = OFF)

End;
go