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
	// Avatar is intentionally excluded here to avoid returning it
	// This is too long to be sending in a response, instead we can create a separate endpoint to get the avatar
	IsDeleted: boolean
	CreatedTimestamp: Date
	CreatedUserId: string | null
	UpdatedTimestamp: Date | null
	UpdatedUserId: string | null
}