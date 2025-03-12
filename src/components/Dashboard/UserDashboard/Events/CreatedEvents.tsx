import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useEventStore } from "@/store/user/event"
import { Event } from "@/types/user/event"

import EventCard from "./EventCard"

interface Props {
    events: Event[]
}

const CreatedEvents = ({ events }: Props) => {
    const { isLoading, fetchMyEvents } = useEventStore()

    return (
        <div>
            {isLoading ? (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <JobLoadingSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events?.length ? (
                        events.map((event: Event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEventAction={fetchMyEvents}
                                isMyEvent
                            />
                        ))
                    ) : (
                        <div>No Events Found</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CreatedEvents
