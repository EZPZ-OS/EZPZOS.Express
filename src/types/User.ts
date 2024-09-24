export interface UpdateUser {
	Username: string
	Email: string
	Salt: string
}

export interface User {
	Id: string
	Username: string
	Password: string
	Salt: string
	Email: string
	Mobile: string | null
	Avatar: Buffer | null
	IsDeleted: boolean
	CreatedTimestamp: Date
	CreatedUserId: string | null
	UpdatedTimestamp: Date | null
	UpdatedUserId: string | null
}