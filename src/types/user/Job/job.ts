// Job Types
export interface JobCompany {
    name: string
    logo_url: string
}

export interface JobPostedBy {
    id: string
    full_name: string
    username: string
    profile_image: string
}

export interface Job {
    id: string
    title: string
    description: string
    location: string
    requirements: string
    is_open: boolean
    job_type: "Part-Time" | "Full-Time" | "Internship" | "Freelance"
    apply_link?: string
    company: JobCompany
    posted_by: JobPostedBy
    created_at?: string
    is_saved?: boolean
}

export interface JobPagination {
    total: number
    page: number
    limit: number
}

export interface JobState {
    jobs: Job[]
    savedJobs: Job[]
    myJobs: Job[]
    jobsPagination: JobPagination
    savedJobsPagination: JobPagination
    myJobsPagination: JobPagination
    isLoading: boolean
    error: string | null
    reportError: string | null; // New field for report-specific errors
    selectedJob: Job | null
    jobsFilters: {
        search: string
        location: string
        company_id: string
        job_type: string
    }
    
    reportJob: (jobId: string, reason: string) => Promise<void>; // New report job method
    fetchJobs: () => Promise<void>
    fetchSavedJobs: (page?: number, limit?: number) => Promise<void>
    fetchMyJobs: (page?: number, limit?: number) => Promise<void>
    saveJob: (jobId: string) => Promise<void>
    createJob: (
        jobData: Omit<Job, "id" | "company" | "posted_by" | "created_at"> & {
            company_id: string
        }
    ) => Promise<void>
    updateJobStatus: (jobId: string, isOpen: boolean) => Promise<void>
    deleteJob: (jobId: string) => Promise<void>
    setSelectedJob: (job: Job | null) => void
    setJobsFilters: (filters: {
        search?: string
        location?: string
        company_id?: string
        job_type?: string
    }) => void
    setJobsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
    setSavedJobsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
    setMyJobsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
}
