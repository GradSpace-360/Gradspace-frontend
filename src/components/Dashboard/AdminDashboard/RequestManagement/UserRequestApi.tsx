import { axiosPrivate } from "@/config/axiosInstance"

interface UserRequest {
    id: string
    email: string
    full_name: string
    department: string
    batch: string
    phone_number: string
    role: "Alumni" | "Student" | "Faculty"
    created_at: string
}

interface PaginatedResponse {
    success: boolean
    data: UserRequest[]
    pagination: {
        total: number
        page: number
        limit: number
    }
}

interface UpdateRequestResponse {
    success: boolean
    message: string
}

interface Filters {
    page: number
    limit: number
}

export const userRequestApi = {
    getRequests: async (filters: Filters): Promise<PaginatedResponse> => {
        try {
            const response = await axiosPrivate.get<PaginatedResponse>(
                `/register/requests`,
                {
                    params: {
                        page: filters.page,
                        limit: filters.limit,
                    },
                }
            )
            return response.data
        } catch (error) {
            console.error("Error fetching registration requests:", error)
            throw error
        }
    },

    approveRequest: async (
        requestId: string
    ): Promise<UpdateRequestResponse> => {
        try {
            const response = await axiosPrivate.patch<UpdateRequestResponse>(
                `/register/${requestId}`,
                { action: "approve" }
            )
            return response.data
        } catch (error) {
            console.error("Error approving request:", error)
            throw error
        }
    },

    rejectRequest: async (
        requestId: string
    ): Promise<UpdateRequestResponse> => {
        try {
            const response = await axiosPrivate.patch<UpdateRequestResponse>(
                `/register/${requestId}`,
                { action: "reject" }
            )
            return response.data
        } catch (error) {
            console.error("Error rejecting request:", error)
            throw error
        }
    },
}
