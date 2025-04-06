export interface EventPostedBy {
    id: string
    full_name: string
    username: string
    profile_image: string
}

export interface Event {
    id: string
    title: string
    description: string
    venue: string
    event_type: "ALUM_EVENT" | "CAMPUS_EVENT"
    register_link?: string
    start_date_time: string
    end_date_time: string
    is_registration_open: boolean
    posted_by: EventPostedBy
    created_at: string
    is_saved?: boolean
}

// Define event report reason type
type EventReportReason = "inappropriateContent" | "Spam" | "Fake Event" | "Safety Concerns"

export interface EventPagination {
    total: number
    page: number
    limit: number
}

export interface EventState {
    events: Event[]
    savedEvents: Event[]
    myEvents: Event[]
    eventsPagination: EventPagination
    savedEventsPagination: EventPagination
    myEventsPagination: EventPagination
    isLoading: boolean
    error: string | null
    reportError: string | null
    selectedEvent: Event | null
    eventsFilters: {
        search: string
        event_type: string
        start_date: string
    }

    fetchEvents: () => Promise<void>
    fetchSavedEvents: (page?: number, limit?: number) => Promise<void>
    fetchMyEvents: (page?: number, limit?: number) => Promise<void>
    saveEvent: (eventId: string) => Promise<void>
    createEvent: (eventData: EventFormData) => Promise<void>
    updateEventStatus: (eventId: string, isOpen: boolean) => Promise<void>
    deleteEvent: (eventId: string) => Promise<void>
    setSelectedEvent: (event: Event | null) => void
    reportEvent: (eventId: string, reason: EventReportReason) => Promise<void> // Add report function
    setEventsFilters: (filters: {
        search?: string
        event_type?: string
        start_date?: string
    }) => void
    setEventsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
    setSavedEventsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
    setMyEventsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
}

export type EventFormData = Omit<
    Event,
    "id" | "posted_by" | "created_at" | "is_saved" | "is_registration_open"
> & {
    start_date_time: string
    end_date_time: string
}

export enum EventType {
    ALUM_EVENT = "ALUM_EVENT",
    CAMPUS_EVENT = "CAMPUS_EVENT",
}
