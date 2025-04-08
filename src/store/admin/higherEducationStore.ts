import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

interface HigherEducation {
    fullName: string
    department: string
    batch: string
    email: string
    course: string
    institutionName: string
    location: string
    startYear: string
    endYear?: string
}

interface HigherEducationFilters {
    department: string
    batch: string
}

interface HigherEducationStore {
    data: HigherEducation[]
    isLoading: boolean
    error: string | null
    filters: HigherEducationFilters
    currentPage: number
    itemsPerPage: number

    fetchHigherEducation: (department: string, batch: string) => Promise<void>
    setFilters: (newFilters: Partial<HigherEducationFilters>) => void
    resetFilters: () => void
    setCurrentPage: (page: number) => void
    setItemsPerPage: (count: number) => void
    paginatedData: () => HigherEducation[]
    totalPages: () => number
}

const useHigherEducationStore = create<HigherEducationStore>((set, get) => ({
    data: [],
    isLoading: false,
    error: null,
    filters: {
        department: "",
        batch: "",
    },
    currentPage: 1,
    itemsPerPage: 10,

    fetchHigherEducation: async (department: string, batch: string) => {
        set({ isLoading: true, error: null })
        try {
            const params = new URLSearchParams()
            if (department) params.append("department", department)
            if (batch) params.append("batch", batch)
            const url = `/education/higher-education${params.toString() ? `?${params}` : ""}`
            const response = await axiosPrivate.get(url)
            const data = response.data
            console.log("Fetched data:", data)
            // Check if data is null or undefined
            if (!data) {
                set({
                    error: "No data found",
                    isLoading: false,
                })
                return
            }

            set({ data: data, isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "An error occurred while fetching data",
                isLoading: false,
            })
        }
    },

    setFilters: (newFilters) => {
        set({
            filters: { ...get().filters, ...newFilters },
            currentPage: 1,
        })
    },

    resetFilters: () => {
        set({
            filters: { department: "", batch: "" },
            currentPage: 1,
        })
    },

    setCurrentPage: (page) => {
        set({ currentPage: page })
    },

    setItemsPerPage: (count) => {
        set({ itemsPerPage: count, currentPage: 1 })
    },

    paginatedData: () => {
        const { currentPage, itemsPerPage } = get()
        const filtered = get().data

        const startIndex = (currentPage - 1) * itemsPerPage
        return filtered.slice(startIndex, startIndex + itemsPerPage)
    },

    totalPages: () => {
        const { itemsPerPage } = get()
        const filtered = get().data
        return Math.ceil(filtered.length / itemsPerPage)
    },
}))

export default useHigherEducationStore
