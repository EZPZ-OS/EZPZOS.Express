USE EZPZOS;

GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[User] WHERE ([Username] = 'Test'))
BEGIN
Insert into [dbo].[User] ([Id],[Username],[Password],[Salt],[Email],[Mobile],[Avatar],[IsDeleted],[CreatedTimestamp],[CreatedUserId],[UpdatedTimestamp],[UpdatedUserId])
Values(Convert(UniqueIdentifier,'2A66057D-F4E5-4E2B-B2F1-38C51A96D385'),'test','test','test','test','test','0x','false',null,null,null,null)
End;


IF NOT EXISTS (SELECT 1 FROM [dbo].[Role] WHERE (Code = '0'))
BEGIN
insert into [dbo].[Role]
Values(NewID(),'0','User',0,null,null,null,null);
END;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Role] WHERE (Code = '1'))
BEGIN
insert into [dbo].[Role]
Values(NewID(),'1','Test2',0,null,null,null,null);
END;



declare @userId uniqueidentifier = (Select Id from [dbo].[User] where Username = 'test');
declare @roleId uniqueidentifier = (Select Id from [dbo].[Role] where Code = '0');
declare @roleId2 uniqueidentifier = (Select Id from [dbo].[Role] where Code = '1');


IF NOT EXISTS (SELECT 1 FROM [dbo].[UserRole] WHERE (UserId = @userId and RoleId=@roleId))
BEGIN

insert into [dbo].[UserRole]
Values(NewID(), @userId, @roleId,0,null,null,null,null);
End;


IF NOT EXISTS (SELECT 1 FROM [dbo].[UserRole] WHERE (UserId = @userId and RoleId=@roleId2))
BEGIN
insert into [dbo].[UserRole]
Values(NewID(), @userId, @roleId2,0,null,null,null,null);
End;

declare @cuisineId uniqueidentifier = '766e6199-4041-4d9c-b121-7e2c48e6c970';

IF NOT EXISTS (SELECT 1 FROM [dbo].[Cuisine] WHERE Id = @cuisineId)
BEGIN
insert into [dbo].[Cuisine]
-- //TODO change branch ID after having branch table
Values(@cuisineId, 'Test', 'Test Description', 100.01, 'Test Cateogry', '', 0, null, '2A66057D-F4E5-4E2B-B2F1-38C51A96D385', 'Branch', 0, GETUTCDATE(), '00000000-0000-0000-0000-000000000000', null, null);
End;

declare @voucherId uniqueidentifier= 'e43ca73a-3de1-497a-9179-9a6d566aec8b';

IF NOT EXISTS (SELECT 1 FROM [dbo].[Voucher] WHERE Id = @voucherId)
BEGIN
insert into [dbo].[Voucher]
Values(@voucherId, '478ed523-265a-4de6-b551-5cf92ef75201', 'Branch', 'TestV', 'Test Voucher', 'Test Description', 10, 0.1, 'Test Type', 100, GETUTCDATE(), GETUTCDATE(), GETUTCDATE(), GETUTCDATE(), GETUTCDATE(), GETUTCDATE(),GETUTCDATE(),'1 2 3 4 5 6 7',0 , GETUTCDATE(), '00000000-0000-0000-0000-000000000000', null, null);
End;

declare @userVoucherId uniqueidentifier = 'd1e81e24-3981-4f3f-82d3-3de64096dbeb';



IF NOT EXISTS (SELECT 1 FROM [dbo].[UserVoucher] WHERE Id = @userVoucherId)
BEGIN
insert into [dbo].[UserVoucher]
Values(@userVoucherId, @userId, @voucherId, 10, 5, GETUTCDATE(), GETUTCDATE(),0 , GETUTCDATE(), '00000000-0000-0000-0000-000000000000', null, null);
End;