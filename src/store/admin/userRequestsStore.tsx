/**
 * useUserRequestsStore.ts
 *
 * This module defines a Zustand store for managing user registration requests.
 * It includes state and actions for fetching, approving, and rejecting requests,
 * as well as handling pagination and loading states.
 *
 * Interfaces:
 * - UserRequest: Represents a user registration request with fields like id, email, full_name, etc.
 * - UserRequestsState: Represents the state of the store, including requests, pagination, and loading state.
 *
 * State:
 * - requests: Array of user requests.
 * - pagination: Object containing pagination details (page, limit, total).
 * - loading: Boolean indicating if data is being fetched.
 *
 * Actions:
 * - fetchRequests: Fetches user requests from the API and updates the state.
 * - approveRequest: Approves a user request and updates the local state.
 * - rejectRequest: Rejects a user request and updates the local state.
 * - setPagination: Updates the pagination state.
 *
 * Dependencies:
 * - `userRequestApi`: API functions for fetching, approving, and rejecting requests.
 * - `toast` from `react-hot-toast` for displaying success/error messages.
 *
 * Usage:
 * - Use this store to manage user requests in the admin dashboard.
 * - Integrate with components to display requests, handle pagination, and perform actions.
 */

import toast from "react-hot-toast"
import { create } from "zustand"

import { userRequestApi } from "../../components/Dashboard/AdminDashboard/RequestManagement/UserRequestApi" // Import the userRequestApi

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

interface UserRequestsState {
    requests: UserRequest[]
    pagination: {
        page: number
        limit: number
        total: number
    }
    loading: boolean
    fetchRequests: () => Promise<void>
    approveRequest: (userId: string) => Promise<void>
    rejectRequest: (userId: string) => Promise<void>
    setPagination: (
        pagination: Partial<UserRequestsState["pagination"]>
    ) => void
}

export const useUserRequestsStore = create<UserRequestsState>((set, get) => ({
    requests: [],
    pagination: {
        page: 1,
        limit: 11,
        total: 0,
    },
    loading: false,
    fetchRequests: async () => {
        set({ loading: true })
        try {
            // Fetch requests from the userRequestApi
            const { data, pagination } = await userRequestApi.getRequests({
                page: get().pagination.page,
                limit: get().pagination.limit,
            })

            set({
                requests: data,
                pagination: {
                    ...get().pagination,
                    total: pagination.total,
                },
                loading: false,
            })
        } catch (error) {
            console.error("Error fetching requests:", error)
            set({ loading: false })
        }
    },
    approveRequest: async (userId) => {
        try {
            // Call the userRequestApi to approve the request
            const response = await userRequestApi.approveRequest(userId)

            // Update the status locally without refetching
            if (response.success) {
                get().fetchRequests()
                toast.success("Request approved successfully.")
            } else {
                toast.error(response.message || "Failed to approve request.")
            }
        } catch (error) {
            console.error("Error approving request:", error)
            toast.error("Error approving request.")
        }
    },
    rejectRequest: async (userId) => {
        // set({ buttonLoading: true })
        try {
            // Call the userRequestApi to reject the request
            const response = await userRequestApi.rejectRequest(userId)

            if (response.success) {
                get().fetchRequests()
                toast.success("Request rejected successfully.")
            } else {
                toast.error(response.message || "Failed to reject request.")
            }
        } catch (error) {
            console.error("Error rejecting request:", error)
            toast.error("Error rejecting request.")
        }
    },
    setPagination: (pagination) =>
        set((state) => ({
            pagination: { ...state.pagination, ...pagination },
        })),
}))
