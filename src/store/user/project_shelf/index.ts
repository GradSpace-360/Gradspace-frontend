import axios from "axios"
import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"
import { ProjectState } from "@/types/user/project_shelf"

export const useProjectStore = create<ProjectState>((set, get) => ({
    projects: [],
    savedProjects: [],
    myProjects: [],
    projectsPagination: { total: 0, page: 1, limit: 9 },
    savedProjectsPagination: { total: 0, page: 1, limit: 9 },
    myProjectsPagination: { total: 0, page: 1, limit: 9 },
    isLoading: false,
    error: null,
    selectedProject: null,
    projectsFilters: { search: "", project_type: "", status: "", year: "" },

    fetchProjects: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/projects/", {
                params: {
                    ...get().projectsFilters,
                    page: get().projectsPagination.page,
                    limit: get().projectsPagination.limit,
                },
            })
            console.log("response projects: ", response.data.data.projects)
            console.log("before projects store update: ", get().projects)
            set({
                projects: response.data.data.projects,
                projectsPagination: response.data.data.pagination,
                isLoading: false,
            })
            console.log("after projects store update: ", get().projects)
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.message
                    : "Failed to fetch projects",
                isLoading: false,
            })
        }
    },

    fetchSavedProjects: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/projects/saved", {
                params: {
                    page: get().savedProjectsPagination.page,
                    limit: get().savedProjectsPagination.limit,
                },
            })
            set({
                savedProjects: response.data.data.projects,
                savedProjectsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.message
                    : "Failed to fetch saved projects",
                isLoading: false,
            })
        }
    },

    fetchMyProjects: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/projects/my-projects", {
                params: {
                    page: get().myProjectsPagination.page,
                    limit: get().myProjectsPagination.limit,
                },
            })
            set({
                myProjects: response.data.data.projects,
                myProjectsPagination: response.data.data.pagination,
                isLoading: false,
            })
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.message
                    : "Failed to fetch my projects",
                isLoading: false,
            })
        }
    },

    saveProject: async (projectId) => {
        try {
            const response = await axiosPrivate.post("/projects/save", {
                project_id: projectId,
            })
            const action = response.data.action
            set((state) => ({
                projects: state.projects.map((project) =>
                    project.id === projectId
                        ? { ...project, is_saved: action === "saved" }
                        : project
                ),
                savedProjects:
                    action === "saved"
                        ? [
                              ...state.savedProjects,
                              state.projects.find((p) => p.id === projectId)!,
                          ]
                        : state.savedProjects.filter((p) => p.id !== projectId),
            }))
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.message
                    : "Failed to save project",
            })
        }
    },

    createProject: async (projectData) => {
        try {
            set({ isLoading: true })
            await axiosPrivate.post("/projects/", projectData)
            await get().fetchMyProjects()
            set({ isLoading: false })
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.response?.data?.errors?.title || error.message
                    : "Failed to create project",
                isLoading: false,
            })
        }
    },

    updateProjectStatus: async (projectId, status) => {
        try {
            set({ isLoading: true })
            await axiosPrivate.patch(`/projects/${projectId}/status`, {
                status,
            })
            await get().fetchMyProjects()
            set({ isLoading: false })
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.message
                    : "Failed to update status",
                isLoading: false,
            })
        }
    },

    deleteProject: async (projectId) => {
        try {
            set({ isLoading: true })
            await axiosPrivate.delete(`/projects/${projectId}`)
            set((state) => ({
                myProjects: state.myProjects.filter(
                    (project) => project.id !== projectId
                ),
            }))
            set({ isLoading: false })
        } catch (error) {
            set({
                error: axios.isAxiosError(error)
                    ? error.message
                    : "Failed to delete project",
                isLoading: false,
            })
        }
    },

    setSelectedProject: (project) => set({ selectedProject: project }),
    setProjectsFilters: (filters) =>
        set((state) => ({
            projectsFilters: { ...state.projectsFilters, ...filters },
        })),
    setProjectsPagination: (pagination) =>
        set((state) => ({
            projectsPagination: { ...state.projectsPagination, ...pagination },
        })),
    setSavedProjectsPagination: (pagination) =>
        set((state) => ({
            savedProjectsPagination: {
                ...state.savedProjectsPagination,
                ...pagination,
            },
        })),
    setMyProjectsPagination: (pagination) =>
        set((state) => ({
            myProjectsPagination: {
                ...state.myProjectsPagination,
                ...pagination,
            },
        })),
}))
