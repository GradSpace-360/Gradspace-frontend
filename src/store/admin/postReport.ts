import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

interface Author {
    id: string
    username: string
}

interface ReportedPost {
    post_id: string
    post_preview: string
    author: Author
    flag_count: number
    top_reason: string
    last_flagged: string
    post_date: string
}

interface Pagination {
    current_page: number
    per_page: number
    total_pages: number
    total_items: number
}

interface PostData {
    id: string
    content: string
    image: string
    createdAt: string
    author: Author
    likes: number
    comments: number
}

interface FlagData {
    reporter: string
    reason: string
    flagged_at: string
}

interface PostReportDetails {
    post_data: PostData
    flag_data: FlagData[]
}

interface PostReportsState {
    // State
    reportedPosts: ReportedPost[]
    pagination: Pagination
    selectedReport: PostReportDetails | null
    isLoading: boolean
    error: string | null

    // Actions
    fetchReportedPosts: (page?: number, limit?: number) => Promise<void>
    fetchPostReportDetails: (postId: string) => Promise<void>
    dismissReports: (postId: string) => Promise<void>
    deletePost: (postId: string) => Promise<void>
    clearSelectedReport: () => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

export const usePostReportsStore = create<PostReportsState>((set, get) => ({
    reportedPosts: [],
    pagination: {
        current_page: 1,
        per_page: 10,
        total_pages: 0,
        total_items: 0,
    },
    selectedReport: null,
    isLoading: false,
    error: null,

    fetchReportedPosts: async (page = 1, limit = 10) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/admin/post-reports/", {
                params: {
                    page,
                    limit,
                },
            })

            set({
                reportedPosts:
                    response.data.data === null ? [] : response.data.data,
                pagination: response.data.meta,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch reported posts",
                isLoading: false,
            })
        }
    },

    fetchPostReportDetails: async (postId: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get(
                `/admin/post-reports/${postId}`
            )

            set({
                selectedReport: response.data,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch report details",
                isLoading: false,
            })
        }
    },

    dismissReports: async (postId: string) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/admin/post-reports/${postId}/dismiss`)

            // Remove the dismissed report from the list
            set((state) => ({
                reportedPosts: state.reportedPosts.filter(
                    (post) => post.post_id !== postId
                ),
                isLoading: false,
            }))

            // Update pagination count
            const { pagination } = get()
            set({
                pagination: {
                    ...pagination,
                    total_items: pagination.total_items - 1,
                },
            })

            // Clear selected report if it's the one being dismissed
            if (get().selectedReport?.post_data.id === postId) {
                set({ selectedReport: null })
            }
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to dismiss reports",
                isLoading: false,
            })
        }
    },

    deletePost: async (postId: string) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/admin/post-reports/posts/${postId}`)

            // Remove the deleted post from the list
            set((state) => ({
                reportedPosts: state.reportedPosts.filter(
                    (post) => post.post_id !== postId
                ),
                isLoading: false,
            }))

            // Update pagination count
            const { pagination } = get()
            set({
                pagination: {
                    ...pagination,
                    total_items: pagination.total_items - 1,
                },
            })

            // Clear selected report if it's the one being deleted
            if (get().selectedReport?.post_data.id === postId) {
                set({ selectedReport: null })
            }
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete post",
                isLoading: false,
            })
        }
    },

    clearSelectedReport: () => set({ selectedReport: null }),

    setPage: (page: number) => {
        set((state) => ({
            pagination: { ...state.pagination, current_page: page },
        }))
        get().fetchReportedPosts(page, get().pagination.per_page)
    },

    setLimit: (limit: number) => {
        set((state) => ({
            pagination: { ...state.pagination, per_page: limit },
        }))
        get().fetchReportedPosts(1, limit) // Reset to first page when changing limit
    },
}))
