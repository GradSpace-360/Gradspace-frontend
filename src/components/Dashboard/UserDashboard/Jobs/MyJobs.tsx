import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Pagination } from "@/components/Pagination"
import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useAuthStore } from "@/store/auth"
import { useJobStore } from "@/store/user/job"

import CreatedJobs from "./CreatedJobs"

const MyJobs = () => {
    const {
        myJobs,
        myJobsPagination,
        fetchMyJobs,
        setMyJobsPagination,
        isLoading: loadingJobs,
    } = useJobStore()

    useEffect(() => {
        fetchMyJobs()
    }, [fetchMyJobs])

    const { user } = useAuthStore()
    const navigate = useNavigate()
    const handlePageChange = (newPage: number) => {
        setMyJobsPagination({ page: newPage })
        fetchMyJobs()
    }

    const totalPages = Math.ceil(
        myJobsPagination.total / myJobsPagination.limit
    )

    if (loadingJobs) {
        ;<div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <JobLoadingSkeleton key={index} />
            ))}
        </div>
    }
    if (user?.role !== "Alumni" && user?.role !== "Faculty") {
        navigate("/dashboard/job-portal")
    }

    return (
        <div className="mt-8 px-6 mb-6">
            <h1 className="gradient-title font-extrabold text-xl sm:text-4xl font-philosopher text-center">
                My Jobs
            </h1>
            <CreatedJobs jobs={myJobs} />
            <Pagination
                currentPage={myJobsPagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default MyJobs
