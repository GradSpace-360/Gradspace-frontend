import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Pagination } from "@/components/Pagination"
import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useAuthStore } from "@/store/auth"
import { useEventStore } from "@/store/user/event"

import CreatedEvents from "./CreatedEvents"

const MyEvents = () => {
    const {
        myEvents,
        myEventsPagination,
        fetchMyEvents,
        setMyEventsPagination,
        isLoading: loadingEvents,
    } = useEventStore()

    const { user } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        fetchMyEvents()
    }, [fetchMyEvents])

    const handlePageChange = (newPage: number) => {
        setMyEventsPagination({ page: newPage })
        fetchMyEvents()
    }

    const totalPages = Math.ceil(
        myEventsPagination.total / myEventsPagination.limit
    )

    if (loadingEvents) {
        return (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <JobLoadingSkeleton key={index} />
                ))}
            </div>
        )
    }

    if (user?.role !== "Alumni" && user?.role !== "Faculty") {
        navigate("/dashboard/events")
    }

    return (
        <div className="mt-8 px-6 mb-6">
            <h1 className="gradient-title font-extrabold text-xl sm:text-4xl font-philosopher text-center">
                My Events
            </h1>
            <CreatedEvents events={myEvents} />
            <Pagination
                currentPage={myEventsPagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default MyEvents
