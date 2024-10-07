/*
  Warnings:

  - You are about to alter the column `Image` on the `Cuisine` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(Max)` to `NVarChar(1000)`.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Cuisine] ALTER COLUMN [Image] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[Image];

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_RoleId_fkey] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[Role]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

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
