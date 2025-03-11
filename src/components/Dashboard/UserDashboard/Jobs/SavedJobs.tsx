import { useEffect } from "react"
import { BarLoader } from "react-spinners"

import { Pagination } from "@/components/Pagination"
import { useJobStore } from "@/store/user/job"
import { Job } from "@/types/user/Job/job"

import JobCard from "./JobCard"

const SavedJobs = () => {
    const {
        savedJobs,
        isLoading: loadingSavedJobs,
        fetchSavedJobs,
        savedJobsPagination,
        setSavedJobsPagination,
    } = useJobStore()

    useEffect(() => {
        fetchSavedJobs()
    }, [fetchSavedJobs])

    const handlePageChange = (newPage: number) => {
        setSavedJobsPagination({ page: newPage })
        fetchSavedJobs()
    }

    const totalPages = Math.ceil(
        savedJobsPagination.total / savedJobsPagination.limit
    )

    return (
        <div className="mt-8 px-6 mb-8">
            <h1 className="gradient-title font-extrabold text-xl sm:text-4xl font-philosopher text-center">
                Saved Jobs
            </h1>
            {loadingSavedJobs && (
                <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            )}

            {!loadingSavedJobs && (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedJobs?.length ? (
                        savedJobs.map((job: Job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onJobAction={fetchSavedJobs}
                                savedInit={true}
                            />
                        ))
                    ) : (
                        <div>No Saved Jobs</div>
                    )}
                </div>
            )}

            <Pagination
                currentPage={savedJobsPagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default SavedJobs
