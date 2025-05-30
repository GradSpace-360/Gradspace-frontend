import { HeartIcon, SquarePenIcon } from "lucide-react"
import { useEffect } from "react"
import { Briefcase } from "react-feather"
import { NavLink } from "react-router-dom"

import JobCard from "@/components/Dashboard/UserDashboard/Jobs/JobCard"
import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useAuthStore } from "@/store/auth"
import { useCompanyStore } from "@/store/user/company"
import { useJobStore } from "@/store/user/job"
import { Company } from "@/types/user/Job/company"
import { Job } from "@/types/user/Job/job"

const JobListing = () => {
    const { user } = useAuthStore()

    const { companies, fetchCompanies } = useCompanyStore()

    const {
        jobs,
        jobsFilters,
        isLoading: loadingJobs,
        fetchJobs,
        setJobsFilters,
        jobsPagination,
        setJobsPagination,
    } = useJobStore()

    useEffect(() => {
        fetchCompanies()
        fetchJobs()
    }, [fetchCompanies, fetchJobs, jobsFilters])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const searchQuery = formData.get("search-query") as string
        setJobsFilters({ search: searchQuery })
        fetchJobs() // Fetch jobs after updating filters
    }
    useEffect(() => {
        fetchCompanies()
        fetchJobs()
    }, [fetchCompanies, fetchJobs])

    const handlePageChange = (newPage: number) => {
        setJobsPagination({ page: newPage })
        fetchJobs() // Fetch jobs for the selected page
    }

    const clearFilters = () => {
        setJobsFilters({
            search: "",
            location: "",
            company_id: "",
            job_type: "",
        })
        fetchJobs() // Fetch jobs after clearing filters
    }

    return (
        <>
            <div className="">
                <div className="flex items-center  justify-between pb-5">
                    {/* <h1 className="hidden md:block"></h1> */}
                    <h1 className="flex items-center gap-2 gradient-title font-semibold text-xl sm:text-3xl font-philosopher">
                        <Briefcase className="w-6 h-6" />
                        Jobs
                    </h1>

                    {/* <h1 className="flex items-center gap-2 gradient-title font-semibold text-xl sm:text-3xl font-philosopher">
                    <CalendarIcon className="w-6 h-6" />
                    Events
                </h1> */}

                    {/* desktop view -> saved-jobs,  my-jobs , post-job  */}
                    <div className=" gap-5 sm:flex-row sm:flex  hidden">
                        {user?.role == "Alumni" || user?.role == "Faculty" ? (
                            <NavLink
                                to="/dashboard/my-jobs"
                                className="flex items-center gap-2 btn btn-outine  p-1 rounded-2xl   border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                            >
                                <Briefcase className="w-4 h-4" />
                                My Jobs
                            </NavLink>
                        ) : (
                            <div></div>
                        )}
                        <NavLink
                            to="/dashboard/saved-jobs"
                            className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-2xl border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                        >
                            <HeartIcon className="w-4 h-4" />
                            Saved Jobs
                        </NavLink>

                        {user?.role == "Alumni" || user?.role == "Faculty" ? (
                            <NavLink
                                to="/dashboard/post-job"
                                className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-2xl border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                            >
                                <SquarePenIcon className="w-4 h-4" />
                                Post a Job
                            </NavLink>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </div>
                {/* mobile view -> saved-jobs,  my-jobs , post-job  */}
                <div className=" gap-5 flex justify-between sm:hidden pb-3   ">
                    <div className=" gap-5  flex-row flex  ">
                        {(user?.role == "Alumni" ||
                            user?.role == "Faculty") && (
                            <NavLink
                                to="/dashboard/my-jobs"
                                className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-2xl border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                            >
                                <Briefcase className="w-4 h-4" />
                                My Jobs
                            </NavLink>
                        )}
                        <NavLink
                            to="/dashboard/saved-jobs"
                            className="flex items-center gap-2 btn btn-outine  p-1 1 rounded-2xl border-2 px-2 hover:bg-primary-foreground  border-border shadow-sm"
                        >
                            <HeartIcon className="w-4 h-4" />
                            Saved Jobs
                        </NavLink>
                    </div>

                    {user?.role == "Alumni" || user?.role == "Faculty" ? (
                        <NavLink
                            to="/dashboard/post-job"
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
                        placeholder="Search Jobs by Title.."
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
                    <Input
                        type="text"
                        placeholder="Filter by Location"
                        value={jobsFilters.location}
                        onChange={(e) =>
                            setJobsFilters({ location: e.target.value })
                        }
                    />

                    <Select
                        value={jobsFilters.company_id}
                        onValueChange={(value) =>
                            setJobsFilters({ company_id: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {companies?.map((company: Company) => (
                                    <SelectItem
                                        key={company.ID}
                                        value={company.ID}
                                    >
                                        {company.Name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        value={jobsFilters.job_type}
                        onValueChange={(value) =>
                            setJobsFilters({ job_type: value })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Full-Time">Full Time</SelectItem>
                            <SelectItem value="Part-Time">Part Time</SelectItem>
                            <SelectItem value="Internship">
                                Internship
                            </SelectItem>
                            <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        className="sm:w-1/2"
                        variant="destructive"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </Button>
                </div>
                {/* Disclaimer Section */}
                <div className="mt-4 p-4 border-l-4 rounded-md bg-gray-100 dark:bg-primary-foreground border-yellow-500 text-gray-900 dark:text-gray-100">
                    <div className="flex italic items-center gap-2">
                        <svg
                            className="w-5 h-5 min-w-[20px]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-sm">
                            <strong>Note:</strong> Job postings are from alumni
                            or faculty but are not institution-verified. Verify
                            details before applying and report suspicious
                            listings. Avoid sharing sensitive information.
                        </p>
                    </div>
                </div>

                {loadingJobs && (
                    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <JobLoadingSkeleton key={index} />
                        ))}
                    </div>
                )}
                {!loadingJobs && (
                    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobs?.length ? (
                            jobs.map((job: Job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    // Adjust based on your actual saved jobs implementation
                                    savedInit={false}
                                />
                            ))
                        ) : (
                            <div className="pl-3">No Jobs Found </div>
                        )}
                    </div>
                )}
            </div>
            <Pagination
                currentPage={jobsPagination.page}
                totalPages={Math.ceil(
                    jobsPagination.total / jobsPagination.limit
                )}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default JobListing
