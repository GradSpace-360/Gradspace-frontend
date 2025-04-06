import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

interface PostedBy {
    id: string
    name: string
}

interface ReportedEvent {
    event_id: string
    event_type: string
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

interface EventData {
    id: string
    title: string
    description: string
    venue: string
    event_type: string
    register_link: string
    start_date_time: string
    end_date_time: string
    is_registration_open: boolean
    posted_by: PosterDetail
    created_at: string
    is_saved: boolean
}

interface FlagData {
    person_who_flagged: {
        id: string
        name: string
    }
    reason: string
    flag_date: string
}

interface EventReportDetails {
    event_data: EventData
    flag_data: FlagData[]
}

interface EventReportsState {
    // State
    reportedEvents: ReportedEvent[]
    pagination: Pagination
    selectedReport: EventReportDetails | null
    isLoading: boolean
    error: string | null

    // Actions
    fetchReportedEvents: (page?: number, limit?: number) => Promise<void>
    fetchEventReportDetails: (eventId: string) => Promise<void>
    dismissReports: (eventId: string) => Promise<void>
    deleteEvent: (eventId: string) => Promise<void>
    clearSelectedReport: () => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

export const useEventReportsStore = create<EventReportsState>((set, get) => ({
    reportedEvents: [],
    pagination: {
        current_page: 1,
        per_page: 10,
        total_pages: 0,
        total_items: 0,
    },
    selectedReport: null,
    isLoading: false,
    error: null,

    fetchReportedEvents: async (page = 1, limit = 10) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/admin/event-reports", {
                params: {
                    page,
                    limit,
                },
            })

            set({
                reportedEvents: response.data.data,
                pagination: response.data.meta,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch reported events",
                isLoading: false,
            })
        }
    },

    fetchEventReportDetails: async (eventId: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get(
                `/admin/event-reports/${eventId}`
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

    dismissReports: async (eventId: string) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/admin/event-reports/${eventId}/dismiss`)

            // Remove the dismissed report from the list
            set((state) => ({
                reportedEvents: state.reportedEvents.filter(
                    (event) => event.event_id !== eventId
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
            if (get().selectedReport?.event_data.id === eventId) {
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

    deleteEvent: async (eventId: string) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/admin/events/${eventId}`)

            // Remove the deleted event from the list
            set((state) => ({
                reportedEvents: state.reportedEvents.filter(
                    (event) => event.event_id !== eventId
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
            if (get().selectedReport?.event_data.id === eventId) {
                set({ selectedReport: null })
            }
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete event",
                isLoading: false,
            })
        }
    },

    clearSelectedReport: () => set({ selectedReport: null }),

    setPage: (page: number) => {
        set((state) => ({
            pagination: { ...state.pagination, current_page: page },
        }))
        get().fetchReportedEvents(page, get().pagination.per_page)
    },

    setLimit: (limit: number) => {
        set((state) => ({
            pagination: { ...state.pagination, per_page: limit },
        }))
        get().fetchReportedEvents(1, limit) // Reset to first page when changing limit
    },
}))
