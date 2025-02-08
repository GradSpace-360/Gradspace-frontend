import { create } from "zustand"

import { userApi } from "@/components/Dashboard/AdminDashboard/UserManagement/ViewUpdateUsers/ViewUpdateApi"

export interface User {
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

interface UsersApiResponse {
    users: User[]
    pagination: {
        page: number
        limit: number
        total: number
    }
}

interface UsersState {
    users: User[]
    pagination: {
        page: number
        limit: number
        total: number
    }
    filters: {
        search: string
        batch: string
        department: string
        role: string
    }
    loading: boolean
    fetchUsers: () => Promise<void>
    setFilters: (filters: Partial<UsersState["filters"]>) => void
    setPagination: (pagination: Partial<UsersState["pagination"]>) => void
    resetFilters: () => void
}
export const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
    filters: {
        search: "",
        batch: "",
        department: "",
        role: "",
    },
    loading: false,
    fetchUsers: async () => {
        set({ loading: true })
        const { filters, pagination } = get()
        try {
            const response: UsersApiResponse = await userApi.getUsers({
                ...filters,
                page: pagination.page,
                limit: pagination.limit,
            })

            // Extract users and pagination from response.data
            set({
                users: response.users, // Now correctly accessing users array
                pagination: {
                    page: response.pagination.page,
                    limit: response.pagination.limit,
                    total: response.pagination.total,
                },
                loading: false,
            })
        } catch (error) {
            console.error("Error fetching users:", error)
            set({ loading: false })
        }
    },
    setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
    setPagination: (pagination) =>
        set((state) => ({
            pagination: { ...state.pagination, ...pagination },
        })),
    resetFilters: () =>
        set({ filters: { search: "", batch: "", department: "", role: "" } }),
}))
