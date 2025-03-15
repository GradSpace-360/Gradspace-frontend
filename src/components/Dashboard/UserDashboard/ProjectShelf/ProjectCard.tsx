import { Bookmark, File, Github, Link2, Trash2, Video } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useProjectStore } from "@/store/user/project_shelf"
import { Project } from "@/types/user/project_shelf"

interface ProjectCardProps {
    project: Project
    onProjectAction?: () => void
    isMyProject?: boolean
}

const ProjectCard = ({
    project,
    onProjectAction = () => {},
    isMyProject = false,
}: ProjectCardProps) => {
    const { saveProject, deleteProject, isLoading } = useProjectStore()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleSave = async () => {
        await saveProject(project.id)
        onProjectAction()
    }

    const confirmDelete = async () => {
        await deleteProject(project.id)
        onProjectAction()
        setShowDeleteDialog(false)
    }

    return (
        <>
            <Card className="flex flex-col rounded-lg">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-between  font-bold ">
                        {project.title}
                        {isMyProject && (
                            <Trash2
                                size={18}
                                className="text-red-300 cursor-pointer hover:text-red-500"
                                onClick={() => setShowDeleteDialog(true)}
                            />
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Badge
                            variant={
                                project.status === "ACTIVE"
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            {project.status}
                        </Badge>
                        <Badge variant="outline">{project.project_type}</Badge>
                        <span className="text-muted-foreground">
                            · {project.year}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Contributors:</span>
                            <span className="text-muted-foreground">
                                {project.contributors.join(", ")}
                            </span>
                        </div>
                        {project.mentor && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Mentor:</span>
                                <span className="text-muted-foreground">
                                    {project.mentor}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.links.code_link && (
                            <a
                                href={project.links.code_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <Github size={16} />
                                Code
                            </a>
                        )}
                        {project.links.website && (
                            <a
                                href={project.links.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <Link2 size={16} />
                                Website
                            </a>
                        )}
                        {project.links.video && (
                            <a
                                href={project.links.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <Video size={16} />
                                Video
                            </a>
                        )}
                        {project.links.files && (
                            <a
                                href={project.links.files}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                                <File size={16} />
                                Files
                            </a>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                    <Link
                        to={`/dashboard/project/${project.id}`}
                        className="flex-1"
                    >
                        <Button variant="secondary" className="w-full">
                            Details
                        </Button>
                    </Link>

                    {!isMyProject && (
                        <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            <Bookmark
                                size={20}
                                fill={
                                    project.is_saved ? "currentColor" : "none"
                                }
                            />
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {showDeleteDialog && (
                <Dialog
                    open
                    onOpenChange={(open) => !open && setShowDeleteDialog(false)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Confirmation</DialogTitle>
                        </DialogHeader>
                        <p className="py-4">
                            This action cannot be undone. Are you sure you want
                            to delete this project?
                        </p>
                        <DialogFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default ProjectCard
