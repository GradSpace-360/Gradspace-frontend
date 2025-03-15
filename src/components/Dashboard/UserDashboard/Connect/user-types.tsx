export interface User {
    id: string
    fullName: string
    userName: string
    profileImage: string
    department: string
    batch: number
    role: string
    isFollowing: boolean
}

export interface UsersResponse {
    users: User[]
    pagination: {
        page: number
        limit: number
        total: number
    }
}

export interface UserFilters {
    role?: string
    batch?: number
    department?: string
    search?: string
    page?: number
    limit?: number
    skills?: string[]
    interests?: string[]
}
