import { File, Github, Link2, Video } from "lucide-react"
import { useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { axiosPrivate } from "@/config/axiosInstance"
import { useAuthStore } from "@/store/auth"
import { useProjectStore } from "@/store/user/project_shelf"
import { ProjectStatus } from "@/types/user/project_shelf"

const ProjectPage = () => {
    const { id } = useParams<{ id: string }>()
    const {
        selectedProject,
        updateProjectStatus,
        setSelectedProject,
        projects,
        savedProjects,
        myProjects,
        isLoading,
    } = useProjectStore()
    const { user } = useAuthStore()

    useEffect(() => {
        if (!id) return
        const allProjects = [...projects, ...savedProjects, ...myProjects]
        const foundProject = allProjects.find((project) => project.id === id)
        if (foundProject) {
            setSelectedProject(foundProject)
        } else {
            setSelectedProject(null)
        }
    }, [id, projects, savedProjects, myProjects, setSelectedProject])

    const handleStatusChange = async (value: ProjectStatus) => {
        if (!id || !selectedProject) return
        try {
            await updateProjectStatus(id, value)
            setSelectedProject({ ...selectedProject, status: value })
        } catch (error) {
            console.error("Failed to update status:", error)
        }
    }

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl p-4">
                <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            </div>
        )
    }

    if (!selectedProject) {
        return (
            <div className="mx-auto max-w-4xl p-4 text-center text-lg">
                Project not found
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-semibold  tracking-tight md:text-4xl">
                            {selectedProject.title}
                        </h1>
                        <div className="flex items-center gap-2 text-lg">
                            <Badge variant="outline">
                                {selectedProject.project_type}
                            </Badge>
                            <span className="text-muted-foreground">
                                · {selectedProject.year}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge
                        variant={
                            selectedProject.status === "ACTIVE"
                                ? "default"
                                : "secondary"
                        }
                        className="gap-2 px-3 py-1 text-sm"
                    >
                        {selectedProject.status}
                    </Badge>
                    <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <Separator />

            {selectedProject.posted_by.id === user?.id && (
                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                    <div className="space-y-1">
                        <p className="font-medium">Manage Project Status</p>
                        <p className="text-sm text-muted-foreground">
                            Update project progress status
                        </p>
                    </div>
                    <Select
                        onValueChange={handleStatusChange}
                        value={selectedProject.status}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <section className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Project Details</h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {selectedProject.description}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Team Information</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="font-medium">Contributors</p>
                            <p className="text-muted-foreground">
                                {selectedProject.contributors.join(", ")}
                            </p>
                        </div>
                        {selectedProject.mentor && (
                            <div>
                                <p className="font-medium">Mentor</p>
                                <p className="text-muted-foreground">
                                    {selectedProject.mentor}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Project Links</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {selectedProject.links.code_link && (
                            <a
                                href={selectedProject.links.code_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                            >
                                <Github className="h-5 w-5" />
                                <span>Code Repository</span>
                            </a>
                        )}
                        {selectedProject.links.website && (
                            <a
                                href={selectedProject.links.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                            >
                                <Link2 className="h-5 w-5" />
                                <span>Live Website</span>
                            </a>
                        )}
                        {selectedProject.links.video && (
                            <a
                                href={selectedProject.links.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                            >
                                <Video className="h-5 w-5" />
                                <span>Demo Video</span>
                            </a>
                        )}
                        {selectedProject.links.files && (
                            <a
                                href={selectedProject.links.files}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 hover:underline"
                            >
                                <File className="h-5 w-5" />
                                <span>Project Files</span>
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <Separator />

            <div className="flex w-full justify-end">
                <NavLink
                    to={`/dashboard/profile/${selectedProject.posted_by.username}`}
                    className="block w-full md:w-1/2"
                >
                    <div className="flex items-center gap-4 rounded-lg p-4 bg-muted/40">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={`${axiosPrivate.defaults.baseURL}/${selectedProject.posted_by.profile_image}`}
                                alt={selectedProject.posted_by.full_name}
                            />
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-medium">
                                {selectedProject.posted_by.full_name}
                            </p>
                            <p className="text-muted-foreground">
                                Posted{" "}
                                {new Date(
                                    selectedProject.created_at
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default ProjectPage
