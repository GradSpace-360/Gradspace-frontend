import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"

import { Pagination } from "@/components/Pagination"
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
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
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
