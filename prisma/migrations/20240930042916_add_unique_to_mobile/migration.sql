/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Mobile]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_Email_key] UNIQUE NONCLUSTERED ([Email]);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_Mobile_key] UNIQUE NONCLUSTERED ([Mobile]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
