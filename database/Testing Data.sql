USE EZPZOS;

GO

IF NOT EXISTS (SELECT 1 FROM [dbo].[Role] WHERE (Code = '0'))
BEGIN
insert into [dbo].[Role]
Values(NewID(),'0','User',0,getDate(),null,null,null);
END;

IF NOT EXISTS (SELECT 1 FROM [dbo].[Role] WHERE (Code = '1'))
BEGIN
insert into [dbo].[Role]
Values(NewID(),'1','Test2',0,getDate(),null,null,null);
END;
