import axios from "axios"
import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"
import { EventState } from "@/types/user/event"

export const useEventStore = create<EventState>((set, get) => ({
    events: [],
    savedEvents: [],
    myEvents: [],
    eventsPagination: { total: 0, page: 1, limit: 9 },
    savedEventsPagination: { total: 0, page: 1, limit: 9 },
    myEventsPagination: { total: 0, page: 1, limit: 9 },
    isLoading: false,
    error: null,
    selectedEvent: null,
    eventsFilters: { search: "", event_type: "", start_date: "" },

    fetchEvents: async () => {
        try {
            set({ isLoading: true, error: null })
            const { eventsFilters } = get()
            const response = await axiosPrivate.get("/events/", {
                params: {
                    ...eventsFilters,
                    page: get().eventsPagination.page,
                    limit: get().eventsPagination.limit,
                },
            })
            set({
                events: response.data.data.events,
                eventsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch events",
                isLoading: false,
            })
        }
    },

    fetchSavedEvents: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/events/saved", {
                params: {
                    page: get().savedEventsPagination.page,
                    limit: get().savedEventsPagination.limit,
                },
            })
            set({
                savedEvents: response.data.data.events,
                savedEventsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch saved events",
                isLoading: false,
            })
        }
    },

    fetchMyEvents: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/events/my-events", {
                params: {
                    page: get().myEventsPagination.page,
                    limit: get().myEventsPagination.limit,
                },
            })
            set({
                myEvents: response.data.data.events,
                myEventsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch my events",
                isLoading: false,
            })
        }
    },

    saveEvent: async (eventId) => {
        try {
            const response = await axiosPrivate.post("/events/save", {
                event_id: eventId,
            })
            const action = response.data.action
            set((state) => ({
                events: state.events.map((event) =>
                    event.id === eventId
                        ? { ...event, is_saved: action === "saved" }
                        : event
                ),
            }))
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to save event",
            })
        }
    },

    createEvent: async (eventData) => {
        try {
            set({ isLoading: true })
            await axiosPrivate.post("/events/", eventData)
            await get().fetchMyEvents()
            set({ isLoading: false })
        } catch (error) {
            let errorMessage = "Failed to create event"
            if (axios.isAxiosError(error)) {
                errorMessage =
                    error.response?.data?.errors?.title || error.message
            }
            set({ error: errorMessage, isLoading: false })
            throw new Error(errorMessage)
        }
    },

    updateEventStatus: async (eventId, isOpen) => {
        try {
            set({ isLoading: true })
            await axiosPrivate.patch(`/events/${eventId}/status`, {
                is_open: isOpen,
            })
            await get().fetchMyEvents()
            set({ isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update status",
                isLoading: false,
            })
        }
    },

    deleteEvent: async (eventId) => {
        try {
            set({ isLoading: true })
            await axiosPrivate.delete(`/events/${eventId}`)
            set((state) => ({
                myEvents: state.myEvents.filter(
                    (event) => event.id !== eventId
                ),
            }))
            set({ isLoading: false })
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

    setSelectedEvent: (event) => set({ selectedEvent: event }),
    setEventsFilters: (filters) =>
        set((state) => ({
            eventsFilters: { ...state.eventsFilters, ...filters },
        })),
    setEventsPagination: (pagination) =>
        set((state) => ({
            eventsPagination: { ...state.eventsPagination, ...pagination },
        })),
    setMyEventsPagination: (pagination) =>
        set((state) => ({
            myEventsPagination: { ...state.myEventsPagination, ...pagination },
        })),
    setSavedEventsPagination: (pagination) =>
        set((state) => ({
            savedEventsPagination: {
                ...state.savedEventsPagination,
                ...pagination,
            },
        })),
}))
