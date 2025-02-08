/**
 * Functions:
 * - `getUsers(filters: Filters): Promise<PaginatedResponse>`:
 *   Fetches a list of users based on the provided filters and pagination settings. Simulates a delay to mimic API behavior.
 *   Filters include:
 *     - `search`: A term to search for in user names or emails.
 *     - `batch`: Filter users by their batch.
 *     - `department`: Filter users by department.
 *     - `role`: Filter users by their role (e.g., Student, Alumni, Faculty).
 *     - `page`: The page number for pagination.
 *     - `limit`: The number of users to fetch per page.
 *
 * - `performAction(userId: number, action: string, reason?: string): Promise<ActionResponse>`:
 *   Performs an action (e.g., activate, deactivate) on a specific user and logs the action.
 *   Parameters:
 *     - `userId`: The unique ID of the user.
 *     - `action`: The action to be performed on the user.
 *     - `reason`: (Optional) The reason for performing the action.
 */
import { axiosPrivate } from "@/config/axiosInstance"

interface User {
    id: string
    full_name: string
    batch: string
    department: string
    email: string
    role: string
    status: boolean
    is_verified: boolean
    registration_status: string
}

interface PaginatedResponse {
    users: User[]
    pagination: {
        total: number
        page: number
        limit: number
    }
}

interface Filters {
    search?: string
    batch?: string
    department?: string
    page: number
    limit: number
}

interface ActionResponse {
    success: boolean
    message: string
}

export const userApi = {
    getUsers: async (filters: Filters): Promise<PaginatedResponse> => {
        const response = await axiosPrivate.get<{
            data: {
                pagination: PaginatedResponse["pagination"]
                users: User[]
            }
        }>("/admin/user-management/users/", {
            params: filters,
        })
        console.log("Fetched users:", response.data.data)
        return response.data.data
    },

    performAction: async (
        userId: string,
        action: string,
        reason?: string
    ): Promise<ActionResponse> => {
        const response = await axiosPrivate.post<ActionResponse>(
            `/admin/user-management/users/${userId}/action`,
            { action, reason }
        )
        console.log("Action response:", response.data)
        return response.data
    },
}
