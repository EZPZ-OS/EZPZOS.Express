/*
  Warnings:

  - Changed the type of `Image` on the `Cuisine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Cuisine] DROP COLUMN [Image];
ALTER TABLE [dbo].[Cuisine] ADD [Image] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
