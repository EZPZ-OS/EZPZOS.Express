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