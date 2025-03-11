import axios from "axios"
import toast from "react-hot-toast"
import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"
import { JobState } from "@/types/user/Job/job"

export const useJobStore = create<JobState>((set, get) => ({
    jobs: [],
    savedJobs: [],
    myJobs: [],
    jobsPagination: { total: 0, page: 1, limit: 9 },
    savedJobsPagination: { total: 0, page: 1, limit: 9 },
    myJobsPagination: { total: 0, page: 1, limit: 9 },
    isLoading: false,
    error: null,
    selectedJob: null,
    jobsFilters: { search: "", location: "", company_id: "", job_type: "" },

    fetchJobs: async () => {
        try {
            set({ isLoading: true, error: null })
            const { jobsFilters } = get()
            const response = await axiosPrivate.get("/jobs/", {
                params: {
                    search: jobsFilters.search,
                    location: jobsFilters.location,
                    company_id: jobsFilters.company_id,
                    job_type: jobsFilters.job_type,
                    page: get().jobsPagination.page,
                    limit: get().jobsPagination.limit,
                },
            })
            set({
                jobs: response.data.data.jobs,
                jobsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch jobs",
                isLoading: false,
            })
        }
    },
    fetchSavedJobs: async () => {
        try {
            set({ isLoading: true, error: null })
            const { savedJobsPagination } = get()
            const response = await axiosPrivate.get("/jobs/saved", {
                params: {
                    page: savedJobsPagination.page,
                    limit: savedJobsPagination.limit,
                },
            })
            set({
                savedJobs: response.data.data.jobs,
                savedJobsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch saved jobs",
                isLoading: false,
            })
        }
    },

    fetchMyJobs: async () => {
        try {
            set({ isLoading: true, error: null })
            const { myJobsPagination } = get()
            const response = await axiosPrivate.get("/jobs/my-jobs", {
                params: {
                    page: myJobsPagination.page,
                    limit: myJobsPagination.limit,
                },
            })
            set({
                myJobs: response.data.data.jobs,
                myJobsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch my jobs",
                isLoading: false,
            })
        }
    },

    saveJob: async (jobId) => {
        try {
            // no need to set isLoading to true here
            // because the loading spinner is shown in the JobCard component
            // set({ isLoading: true, error: null })
            const response = await axiosPrivate.post("/jobs/save", {
                job_id: jobId,
            })
            const action = response.data.action // "saved" or "removed"
            set((state) => ({
                jobs: state.jobs.map((job) =>
                    job.id === jobId
                        ? { ...job, is_saved: action === "saved" }
                        : job
                ),
            }))

            if (action === "saved") {
                toast.success("Job saved successfully!")
            } else if (action === "removed") {
                toast.success("Job removed successfully!")
            }
            // set({ isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to save job",
                isLoading: false,
            })
        }
    },

    createJob: async (jobData) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.post("/jobs/", jobData)
            await get().fetchMyJobs()
            set({ isLoading: false })
        } catch (error) {
            let errorMessage = "Failed to create job"
            console.log(error)
            if (axios.isAxiosError(error)) {
                console.log("axios error")
                errorMessage =
                    error.response?.data?.errors?.title || error.message
                console.log(errorMessage)
            } else if (error instanceof Error) {
                errorMessage = error.message
                console.log("error message non axios")
                console.log(errorMessage)
            }
            set({ error: errorMessage, isLoading: false })
            throw new Error(errorMessage) // Re-throw error for component handling
        }
    },

    updateJobStatus: async (jobId, isOpen) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.patch(`/jobs/${jobId}/status`, {
                is_open: isOpen,
            })
            await get().fetchMyJobs()
            set({ isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update job status",
                isLoading: false,
            })
        }
    },

    deleteJob: async (jobId) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/jobs/${jobId}`)
            set((state) => ({
                myJobs: state.myJobs.filter((job) => job.id !== jobId),
            }))
            set({ isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete job",
                isLoading: false,
            })
        }
    },

    setSelectedJob: (job) => set({ selectedJob: job }),
    setJobsFilters: (filters) =>
        set((state) => ({
            jobsFilters: { ...state.jobsFilters, ...filters },
        })),
    setJobsPagination: (pagination) =>
        set((state) => ({
            jobsPagination: { ...state.jobsPagination, ...pagination },
        })),
    setSavedJobsPagination: (pagination) =>
        set((state) => ({
            savedJobsPagination: {
                ...state.savedJobsPagination,
                ...pagination,
            },
        })),
    setMyJobsPagination: (pagination) =>
        set((state) => ({
            myJobsPagination: { ...state.myJobsPagination, ...pagination },
        })),
}))
