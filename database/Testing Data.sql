
Insert into [dbo].[User] ([Id],[Username],[Password],[Salt],[Email],[Mobile],[Avatar],[IsDeleted],[CreatedTimestamp],[CreatedUserId],[UpdatedTimestamp],[UpdatedUserId])
Values(Convert(UniqueIdentifier,'2A66057D-F4E5-4E2B-B2F1-38C51A96D385'),'test','test','test','test','test','0x','false',null,null,null,null)

declare @userId uniqueidentifier = (Select Id from [dbo].[User] where Username = 'test');

insert into [dbo].[Role]
Values(NewID(),'Test','Test',0,null,null,null,null);
insert into [dbo].[Role]
Values(NewID(),'Test2','Test2',0,null,null,null,null);

declare @roleId uniqueidentifier = (Select Id from [dbo].[Role] where Name = 'Test');
declare @roleId2 uniqueidentifier = (Select Id from [dbo].[Role] where Name = 'Test2');



insert into [dbo].[UserRole]
Values(NewID(), @userId, @roleId,0,null,null,null,null);

insert into [dbo].[UserRole]
Values(NewID(), @userId, @roleId2,0,null,null,null,null);