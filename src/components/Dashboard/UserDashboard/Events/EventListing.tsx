import { format } from "date-fns"
import { CalendarIcon, HeartIcon, SquarePenIcon } from "lucide-react"
import { CalendarDays, LayoutList } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useAuthStore } from "@/store/auth"
import { useEventStore } from "@/store/user/event"
import { Event } from "@/types/user/event"

import { CalendarView } from "./calendar-view"
import EventCard from "./EventCard"

const EventListing = () => {
    const { user } = useAuthStore()
    const {
        events,
        eventsFilters,
        isLoading,
        fetchEvents,
        setEventsFilters,
        eventsPagination,
        setEventsPagination,
        // setSelectedEvent,
    } = useEventStore()
    const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid")
    const navigate = useNavigate()
    useEffect(() => {
        fetchEvents()
    }, [fetchEvents, eventsFilters])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const searchQuery = formData.get("search-query") as string
        setEventsFilters({ search: searchQuery })
        fetchEvents()
    }

    const handlePageChange = (newPage: number) => {
        setEventsPagination({ page: newPage })
        fetchEvents()
    }

    const handleEventClick = (event: Event) => {
        // setSelectedEvent(event)
        navigate(`/dashboard/event/${event.id}`)
    }

    const clearFilters = () => {
        setEventsFilters({
            search: "",
            event_type: "",
            start_date: "",
        })
        fetchEvents()
    }

    return (
        <div className="">
            <div className="flex items-center  justify-between pb-5">
                <h1 className="flex items-center gap-2 gradient-title font-semibold text-xl sm:text-3xl font-philosopher">
                    <CalendarIcon className="w-6 h-6" />
                    Events
                </h1>

                {/* desktop view -> saved-jobs,  my-jobs , post-job  */}
                <div className=" gap-5 sm:flex-row sm:flex  hidden">
                    {user?.role == "Alumni" || user?.role == "Faculty" ? (
                        <Button
                            variant={"outline"}
                            onClick={() => navigate("/dashboard/my-events")}
                            className="flex items-center gap-2 btn btn-outine  p-1 rounded-lg  px-2   border-2 shadow-sm"
                        >
                            <CalendarIcon className="w-4 h-4" />
                            My Events
                        </Button>
                    ) : (
                        <div></div>
                    )}
                    <Button
                        variant={"outline"}
                        onClick={() => navigate("/dashboard/saved-events")}
                        className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-lg border-2 px-2   border-border shadow-sm"
                    >
                        <HeartIcon className="w-4 h-4" />
                        Saved Events
                    </Button>

                    {user?.role == "Alumni" || user?.role == "Faculty" ? (
                        <Button
                            variant={"default"}
                            onClick={() => navigate("/dashboard/post-event")}
                            className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-lg border-2 px-2   border-border shadow-sm"
                        >
                            <SquarePenIcon className="w-4 h-4" />
                            {/* Post a Event */}
                        </Button>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>
            {/* mobile view -> saved-jobs,  my-jobs , post-job  */}
            <div className=" gap-5 flex justify-between sm:hidden pb-3   ">
                <div className=" gap-5  flex-row flex  ">
                    {(user?.role == "Alumni" || user?.role == "Faculty") && (
                        <NavLink
                            to="/dashboard/my-events"
                            className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-2xl border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                        >
                            <CalendarIcon className="w-4 h-4" />
                            My Events
                        </NavLink>
                    )}
                    <NavLink
                        to="/dashboard/saved-events"
                        className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-2xl border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                    >
                        <HeartIcon className="w-4 h-4" />
                        Saved Events
                    </NavLink>
                </div>

                {user?.role == "Alumni" || user?.role == "Faculty" ? (
                    <NavLink
                        to="/dashboard/post-event"
                        className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-2xl border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                    >
                        <SquarePenIcon className="w-4 h-4" />
                    </NavLink>
                ) : (
                    <div></div>
                )}
            </div>

            <form
                onSubmit={handleSearch}
                className="h-10 flex flex-row w-full gap-2 items-center mb-3"
            >
                <Input
                    type="text"
                    placeholder="Search events..."
                    name="search-query"
                    className="h-full flex-1 px-4 text-md"
                />
                <Button
                    type="submit"
                    className="h-full sm:w-28"
                    variant="secondary"
                >
                    Search
                </Button>
            </form>

            <div className="flex flex-col sm:flex-row gap-2">
                <Select
                    value={eventsFilters.event_type}
                    onValueChange={(value) =>
                        setEventsFilters({ event_type: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALUM_EVENT">Alumni Event</SelectItem>
                        <SelectItem value="CAMPUS_EVENT">
                            Campus Event
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !eventsFilters.start_date &&
                                    "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventsFilters.start_date ? (
                                format(
                                    new Date(eventsFilters.start_date),
                                    "PPP"
                                )
                            ) : (
                                <span>Pick a start date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                        <CalendarUI
                            mode="single"
                            selected={
                                eventsFilters.start_date
                                    ? new Date(eventsFilters.start_date)
                                    : undefined
                            }
                            onSelect={(date) => {
                                if (date) {
                                    setEventsFilters({
                                        start_date: date
                                            .toISOString()
                                            .split("T")[0],
                                    })
                                }
                            }}
                            autoFocus
                        />
                    </PopoverContent>
                </Popover>

                <Button
                    className="sm:w-1/2"
                    variant="destructive"
                    onClick={clearFilters}
                >
                    Clear Filters
                </Button>
            </div>
            <div className="flex justify-center mt-4 mb-4">
                <div className="bg-muted rounded-lg p-1 flex">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="gap-1"
                    >
                        <LayoutList className="h-4 w-4" />
                        <span className="hidden sm:inline">Grid</span>
                    </Button>
                    <Button
                        variant={viewMode === "calendar" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                        className="gap-1"
                    >
                        <CalendarDays className="h-4 w-4" />
                        <span className="hidden sm:inline">Calendar</span>
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <JobLoadingSkeleton key={index} />
                    ))}
                </div>
            )}

            {!isLoading && (
                <>
                    {viewMode === "grid" ? (
                        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {events.length ? (
                                events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            ) : (
                                <div className="pl-3">No Events Found</div>
                            )}
                        </div>
                    ) : (
                        <div className="mt-8">
                            <CalendarView
                                events={events}
                                onEventClick={handleEventClick}
                            />
                        </div>
                    )}
                </>
            )}

            <Pagination
                currentPage={eventsPagination.page}
                totalPages={Math.ceil(
                    eventsPagination.total / eventsPagination.limit
                )}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default EventListing
