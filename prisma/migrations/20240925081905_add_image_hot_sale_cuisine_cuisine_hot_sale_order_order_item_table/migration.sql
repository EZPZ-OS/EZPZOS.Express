BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Code] INT NOT NULL,
    [Description] NVARCHAR,
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
    [Username] NVARCHAR NOT NULL,
    [Password] NVARCHAR NOT NULL,
    [Salt] NVARCHAR NOT NULL,
    [Email] NVARCHAR NOT NULL,
    [Mobile] NVARCHAR NOT NULL,
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
CREATE TABLE [dbo].[Image] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Name] NVARCHAR NOT NULL,
    [Path] NVARCHAR(1000) NOT NULL,
    [Content] VARBINARY(max) NOT NULL,
    [CuisineId] UNIQUEIDENTIFIER NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [Image_pkey] PRIMARY KEY CLUSTERED ([Id])
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
    [Name] NVARCHAR(255) NOT NULL,
    [Description] NVARCHAR(1000),
    [Price] FLOAT(53) NOT NULL,
    [Category] NVARCHAR(255) NOT NULL,
    [IsAvailable] BIT NOT NULL,
    [EstimatedTime] INT NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [Cuisine_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[CuisineHotSale] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [Category] NVARCHAR(255) NOT NULL,
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
    [Comments] NVARCHAR(1000),
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [OrderItem_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Order] (
    [Id] UNIQUEIDENTIFIER NOT NULL,
    [UserId] UNIQUEIDENTIFIER NOT NULL,
    [TableNumber] NVARCHAR(255) NOT NULL,
    [PaymentOption] NVARCHAR(1000) NOT NULL,
    [CompletedTimestamp] DATETIME,
    [PickupTimestamp] DATETIME,
    [IsPaid] BIT NOT NULL,
    [BranchId] UNIQUEIDENTIFIER NOT NULL,
    [CreatedTimestamp] DATETIME NOT NULL,
    [UpdatedTimestamp] DATETIME,
    CONSTRAINT [Order_pkey] PRIMARY KEY CLUSTERED ([Id])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_RoleId_fkey] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Image] ADD CONSTRAINT [Image_CuisineId_fkey] FOREIGN KEY ([CuisineId]) REFERENCES [dbo].[Cuisine]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CuisineHotSale] ADD CONSTRAINT [CuisineHotSale_CuisineId_fkey] FOREIGN KEY ([CuisineId]) REFERENCES [dbo].[Cuisine]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CuisineHotSale] ADD CONSTRAINT [CuisineHotSale_HotSaleId_fkey] FOREIGN KEY ([HotSaleId]) REFERENCES [dbo].[HotSale]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[OrderItem] ADD CONSTRAINT [OrderItem_OrderId_fkey] FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Order]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
