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
Values(NewID(),'1','Admin',0,getDate(),null,null,null);
END;

INSERT INTO [dbo].[User] 
(
    [Id], 
    [Username], 
    [Password], 
    [Salt], 
    [Email], 
    [Mobile], 
    [Avatar], 
    [IsDeleted], 
    [CreatedTimestamp], 
    [CreatedUserId], 
    [UpdatedTimestamp], 
    [UpdatedUserId]
) 
VALUES 
(
    NEWID(), -- Unique identifier for the Id field
    'Admin', -- Replace with actual username
    'SamplePassword', -- Replace with actual hashed password
    'SampleSalt', -- Replace with actual salt value
    'admin@example.com', -- Replace with actual email
    '+61412345678', -- Replace with actual mobile number
    NULL, -- Avatar, set to NULL or image data
    0, -- IsDeleted (0 = not deleted, 1 = deleted)
    GETDATE(), -- CreatedTimestamp as the current datetime
    NEWID(), -- Replace with actual CreatedUserId
    GETDATE(), -- UpdatedTimestamp as the current datetime
    NEWID() -- Replace with actual UpdatedUserId
);

-- Link the user to the admin role
INSERT INTO [dbo].[UserRole] 
(
    [Id], 
    [UserId], 
    [RoleId], 
    [IsDeleted], 
    [CreatedTimestamp], 
    [CreatedUserId], 
    [UpdatedTimestamp], 
    [UpdatedUserId]
)
VALUES 
(
    NEWID(), -- Unique identifier for the UserRole Id
    (SELECT [Id] FROM [dbo].[User] WHERE [Username] = 'Admin'), -- UserId for the admin user
    (SELECT [Id] FROM [dbo].[Role] WHERE [Code] = 1), -- RoleId for the admin role
    0, -- IsDeleted (0 = not deleted)
    GETDATE(), -- CreatedTimestamp as the current datetime
    NEWID(), -- CreatedUserId, can be the same as the user Id if self-created
    GETDATE(), -- UpdatedTimestamp as the current datetime
    NEWID() -- UpdatedUserId
);

ALTER TABLE Cuisine
ALTER COLUMN Image NVARCHAR(MAX);