import { useEffect } from "react"

import { Pagination } from "@/components/Pagination"
import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useEventStore } from "@/store/user/event"
import { Event } from "@/types/user/event"

import EventCard from "./EventCard"

const SavedEvents = () => {
    const {
        savedEvents,
        isLoading: loadingSavedEvents,
        fetchSavedEvents,
        savedEventsPagination,
        setSavedEventsPagination,
    } = useEventStore()

    useEffect(() => {
        fetchSavedEvents()
    }, [fetchSavedEvents])

    const handlePageChange = (newPage: number) => {
        setSavedEventsPagination({ page: newPage })
        fetchSavedEvents()
    }

    const totalPages = Math.ceil(
        savedEventsPagination.total / savedEventsPagination.limit
    )

    return (
        <div className="mt-8 px-6 mb-8">
            <h1 className="gradient-title font-extrabold text-xl sm:text-4xl font-philosopher text-center">
                Saved Events
            </h1>

            {loadingSavedEvents && (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <JobLoadingSkeleton key={index} />
                    ))}
                </div>
            )}

            {!loadingSavedEvents && (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedEvents?.length ? (
                        savedEvents.map((event: Event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEventAction={fetchSavedEvents}
                                // savedInit={true}
                            />
                        ))
                    ) : (
                        <div>No Saved Events</div>
                    )}
                </div>
            )}

            <Pagination
                currentPage={savedEventsPagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default SavedEvents
