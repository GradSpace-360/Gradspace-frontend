import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"
import { CompanyState } from "@/types/user/Job/company"

export const useCompanyStore = create<CompanyState>((set) => ({
    companies: [],
    isLoading: false,
    error: null,
    selectedCompany: null,

    fetchCompanies: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/companies/")
            set({
                companies: response.data.data,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch companies",
                isLoading: false,
            })
        }
    },

    createCompany: async (formData) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.post("/companies/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            set((state) => ({
                companies: [response.data.data, ...state.companies],
            }))
            set({ isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to create company",
                isLoading: false,
            })
        }
    },

    updateCompany: async (companyId, formData) => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.put(
                `/companies/${companyId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            )
            set((state) => ({
                companies: state.companies.map((company) =>
                    company.ID === companyId ? response.data.data : company
                ),
            }))
            set({ isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update company",
                isLoading: false,
            })
        }
    },

    deleteCompany: async (companyId) => {
        try {
            set({ isLoading: true, error: null })
            await axiosPrivate.delete(`/companies/${companyId}`)
            set((state) => ({
                companies: state.companies.filter(
                    (company) => company.ID !== companyId
                ),
            }))
            set({ isLoading: false })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete company",
                isLoading: false,
            })
        }
    },

    setSelectedCompany: (company) => set({ selectedCompany: company }),
}))
