import { Layers, SquarePenIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useProjectStore } from "@/store/user/project_shelf"

import ProjectCard from "./ProjectCard"

const ProjectListing = () => {
    const navigate = useNavigate()
    const {
        projects,
        projectsFilters,
        isLoading,
        fetchProjects,
        setProjectsFilters,
        projectsPagination,
        setProjectsPagination,
    } = useProjectStore()
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects, projectsFilters, projectsPagination.page])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setProjectsFilters({ search: searchQuery })
    }

    const handlePageChange = (newPage: number) => {
        setProjectsPagination({ page: newPage })
    }

    const clearFilters = () => {
        setProjectsFilters({
            search: "",
            project_type: "",
            status: "",
            year: "",
        })
        setSearchQuery("")
    }

    const totalPages = Math.ceil(
        projectsPagination.total / projectsPagination.limit
    )

    return (
        <div className="">
            <div className="flex items-center justify-between pb-5">
                <h1 className="flex items-center gap-2 gradient-title font-semibold text-xl sm:text-3xl font-philosopher">
                    <Layers className="w-6 h-6" />
                    Projects
                </h1>

                {/* Desktop Navigation */}
                <div className="gap-5 sm:flex-row sm:flex hidden">
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/my-projects")}
                        className="flex items-center gap-2"
                    >
                        <Layers className="w-4 h-4" />
                        My Projects
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/dashboard/saved-projects")}
                        className="flex items-center gap-2"
                    >
                        <Layers className="w-4 h-4" />
                        Saved Projects
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => navigate("/dashboard/post-project")}
                        className="flex items-center gap-2"
                    >
                        <SquarePenIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="gap-5 flex justify-between sm:hidden pb-3">
                <div className="gap-5 flex-row flex">
                    <NavLink
                        to="/dashboard/my-projects"
                        className="flex items-center gap-2 btn btn-outine p-1 rounded-2xl border-2 px-2 hover:bg-primary-foreground"
                    >
                        <Layers className="w-4 h-4" />
                        My Projects
                    </NavLink>
                    <NavLink
                        to="/dashboard/saved-projects"
                        className="flex items-center gap-2 btn btn-outine p-1 rounded-2xl border-2 px-2 hover:bg-primary-foreground"
                    >
                        <Layers className="w-4 h-4" />
                        Saved
                    </NavLink>
                </div>
                <NavLink
                    to="/dashboard/post-project"
                    className="flex items-center gap-2 btn btn-outine p-1 rounded-2xl border-2 px-2 hover:bg-primary-foreground"
                >
                    <SquarePenIcon className="w-4 h-4" />
                </NavLink>
            </div>

            <form
                onSubmit={handleSearch}
                className="h-10 flex flex-row w-full gap-2 items-center mb-3"
            >
                <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                <Select
                    value={projectsFilters.project_type}
                    onValueChange={(value) =>
                        setProjectsFilters({ project_type: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Project Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PERSONAL">Personal</SelectItem>
                        <SelectItem value="GROUP">Group</SelectItem>
                        <SelectItem value="COLLEGE">College</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={projectsFilters.status}
                    onValueChange={(value) =>
                        setProjectsFilters({ status: value })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    type="number"
                    placeholder="Year"
                    value={projectsFilters.year}
                    onChange={(e) =>
                        setProjectsFilters({ year: e.target.value })
                    }
                    className="w-[150px]"
                />

                <Button
                    className="sm:w-1/2"
                    variant="destructive"
                    onClick={clearFilters}
                >
                    Clear Filters
                </Button>
            </div>

            {isLoading ? (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <JobLoadingSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.length ? (
                            projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                />
                            ))
                        ) : (
                            <div className="pl-3">No Projects Found</div>
                        )}
                    </div>

                    <Pagination
                        currentPage={projectsPagination.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    )
}

export default ProjectListing
