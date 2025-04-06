import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

interface PostedBy {
    id: string
    name: string
}

interface ReportedJob {
    job_id: string
    job_type: string
    title: string
    posted_by: PostedBy
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

interface PosterDetail {
    id: string
    full_name: string
    user_name: string
    profile_image: string
}

interface CompanyDetail {
    name: string
    logo_url: string
}

interface JobData {
    id: string
    title: string
    description: string
    location: string
    requirements: string
    is_open: boolean
    job_type: string
    apply_link: string
    company: CompanyDetail
    posted_by: PosterDetail
    created_at: string
}

interface FlagData {
    reporter: {
        id: string
        name: string
    }
    reason: string
    flag_date: string
}

interface JobReportDetails {
    job_data: JobData
    flag_data: FlagData[]
}

interface JobReportsState {
    // State
    reportedJobs: ReportedJob[]
    pagination: Pagination
    selectedReport: JobReportDetails | null
    isLoading: boolean
    error: string | null

    // Actions
    fetchReportedJobs: (page?: number, limit?: number) => Promise<void>
    fetchJobReportDetails: (jobId: string) => Promise<void>
    dismissReports: (jobId: string) => Promise<void>
    deleteJob: (jobId: string) => Promise<void>
    clearSelectedReport: () => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

export const useJobReportsStore = create<JobReportsState>((set, get) => ({
    reportedJobs: [],
    pagination: {
        current_page: 1,
        per_page: 10,
        total_pages: 0,
        total_items: 0,
    },
    selectedReport: null,
    isLoading: false,
    error: null,

    fetchReportedJobs: async (page = 1, limit = 10) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/admin/job-reports", {
                params: {
                    page,
                    limit,
                },
            })

            set({
                reportedJobs: response.data.data,
                pagination: response.data.meta,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch reported jobs",
                isLoading: false,
            })
        }
    },

    fetchJobReportDetails: async (jobId: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get(
                `/admin/job-reports/${jobId}`
            )

            set({
                selectedReport: response.data.data,
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

    dismissReports: async (jobId: string) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/admin/job-reports/${jobId}/dismiss`)

            // Remove the dismissed report from the list
            set((state) => ({
                reportedJobs: state.reportedJobs.filter(
                    (job) => job.job_id !== jobId
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
            if (get().selectedReport?.job_data.id === jobId) {
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

    deleteJob: async (jobId: string) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/admin/jobs/${jobId}`)

            // Remove the deleted job from the list
            set((state) => ({
                reportedJobs: state.reportedJobs.filter(
                    (job) => job.job_id !== jobId
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
            if (get().selectedReport?.job_data.id === jobId) {
                set({ selectedReport: null })
            }
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete job",
                isLoading: false,
            })
        }
    },

    clearSelectedReport: () => set({ selectedReport: null }),

    setPage: (page: number) => {
        set((state) => ({
            pagination: { ...state.pagination, current_page: page },
        }))
        get().fetchReportedJobs(page, get().pagination.per_page)
    },

    setLimit: (limit: number) => {
        set((state) => ({
            pagination: { ...state.pagination, per_page: limit },
        }))
        get().fetchReportedJobs(1, limit) // Reset to first page when changing limit
    },
}))
