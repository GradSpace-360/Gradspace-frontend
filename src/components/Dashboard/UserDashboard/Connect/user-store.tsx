import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

import { User, UserFilters } from "./user-types"

interface UserState {
    users: User[]
    suggestedUsers: User[]
    filters: UserFilters
    pagination: {
        page: number
        limit: number
        total: number
    }
    isLoading: boolean
    error: string | null
    fetchSuggestedUsers: () => Promise<void>
    fetchUsers: (filters?: UserFilters) => Promise<void>
    toggleFollow: (userId: string, isFollowing: boolean) => Promise<void>
    setFilters: (filters: UserFilters) => void
    setPagination: (pagination: { page: number }) => void
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],
    suggestedUsers: [],
    filters: {},
    pagination: { page: 1, limit: 9, total: 0 },
    isLoading: false,
    error: null,

    fetchSuggestedUsers: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/connect/suggested-users")
            set({ suggestedUsers: response.data.data.users, isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch suggested users",
                isLoading: false,
            })
        }
    },

    fetchUsers: async (filters = {}) => {
        try {
            set({ isLoading: true, error: null })
            const currentFilters = { ...get().filters, ...filters }
            const response = await axiosPrivate.get("/connect/users", {
                params: {
                    ...currentFilters,
                    page: get().pagination.page,
                    limit: get().pagination.limit,
                },
            })
            set({
                users: response.data.data.users,
                pagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch users",
                isLoading: false,
            })
        }
    },

    toggleFollow: async (userName, isFollowing) => {
        try {
            // Optimistic update
            set((state) => ({
                users: state.users.map((user) =>
                    user.userName === userName
                        ? { ...user, isFollowing: !isFollowing }
                        : user
                ),
                suggestedUsers: state.suggestedUsers.map((user) =>
                    user.userName === userName
                        ? { ...user, isFollowing: !isFollowing }
                        : user
                ),
            }))

            await axiosPrivate.post(`/profile/${userName}/follow`)
        } catch (error) {
            // Rollback on error
            set((state) => ({
                users: state.users.map((user) =>
                    user.userName === userName ? { ...user, isFollowing } : user
                ),
                suggestedUsers: state.suggestedUsers.map((user) =>
                    user.userName === userName ? { ...user, isFollowing } : user
                ),
            }))
            throw error
        }
    },

    setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
    setPagination: (pagination) =>
        set((state) => ({
            pagination: { ...state.pagination, ...pagination },
        })),
}))
