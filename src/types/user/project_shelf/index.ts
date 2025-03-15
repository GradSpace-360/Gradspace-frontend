export interface ProjectPostedBy {
    id: string
    full_name: string
    username: string
    profile_image: string
}

export interface ProjectLinks {
    code_link?: string
    video?: string
    files?: string
    website?: string
}

export type ProjectType = "PERSONAL" | "GROUP" | "COLLEGE"

export type ProjectStatus = "ACTIVE" | "COMPLETED"

export interface Project {
    id: string
    title: string
    description: string
    tags: string[]
    project_type: ProjectType
    year: number
    mentor?: string
    contributors: string[]
    links: ProjectLinks
    status: ProjectStatus
    posted_by: ProjectPostedBy
    created_at: string
    is_saved?: boolean
}

export interface ProjectFormData {
    title: string
    description: string
    tags: string[]
    project_type: ProjectType
    year: number
    mentor?: string
    contributors: string[]
    links: ProjectLinks
    status: ProjectStatus
}

export interface Pagination {
    total: number
    page: number
    limit: number
}

export interface ProjectState {
    projects: Project[]
    savedProjects: Project[]
    myProjects: Project[]
    projectsPagination: Pagination
    savedProjectsPagination: Pagination
    myProjectsPagination: Pagination
    isLoading: boolean
    error: string | null
    selectedProject: Project | null
    projectsFilters: {
        search: string
        project_type: string
        status: string
        year: string
    }

    fetchProjects: () => Promise<void>
    fetchSavedProjects: () => Promise<void>
    fetchMyProjects: () => Promise<void>
    saveProject: (projectId: string) => Promise<void>
    createProject: (projectData: ProjectFormData) => Promise<void>
    updateProjectStatus: (
        projectId: string,
        status: ProjectStatus
    ) => Promise<void>
    deleteProject: (projectId: string) => Promise<void>
    setSelectedProject: (project: Project | null) => void
    setProjectsFilters: (filters: {
        search?: string
        project_type?: string
        status?: string
        year?: string
    }) => void
    setProjectsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
    setSavedProjectsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
    setMyProjectsPagination: (pagination: {
        page?: number
        limit?: number
        total?: number
    }) => void
}
