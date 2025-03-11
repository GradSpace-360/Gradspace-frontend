import { BarLoader } from "react-spinners"

import { useJobStore } from "@/store/user/job"
import { Job } from "@/types/user/Job/job"

import JobCard from "./JobCard"

interface Props {
    jobs: Job[]
}

const CreatedJobs = ({ jobs }: Props) => {
    const { isLoading, fetchMyJobs } = useJobStore()

    return (
        <div>
            {isLoading ? (
                <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
            ) : (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs?.length ? (
                        jobs.map((job: Job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onJobAction={fetchMyJobs}
                                isMyJob
                            />
                        ))
                    ) : (
                        <div>No Jobs Found </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CreatedJobs
