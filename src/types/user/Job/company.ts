// Company Types
export interface Company {
    ID: string
    CreatedAt: string
    UpdatedAt: string
    Name: string
    LogoURL: string
}

export interface CompanyState {
    companies: Company[]
    isLoading: boolean
    error: string | null
    selectedCompany: Company | null

    fetchCompanies: () => Promise<void>
    createCompany: (formData: FormData) => Promise<void>
    updateCompany: (companyId: string, formData: FormData) => Promise<void>
    deleteCompany: (companyId: string) => Promise<void>
    setSelectedCompany: (company: Company | null) => void
}
