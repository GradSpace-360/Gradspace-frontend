import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useProjectStore } from "@/store/user/project_shelf"
import { Project } from "@/types/user/project_shelf"

import ProjectCard from "./ProjectCard"

interface Props {
    projects: Project[]
}

const CreatedProjects = ({ projects }: Props) => {
    const { isLoading, fetchMyProjects } = useProjectStore()

    return (
        <div>
            {isLoading ? (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <JobLoadingSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects?.length ? (
                        projects.map((project: Project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onProjectAction={fetchMyProjects}
                                isMyProject
                            />
                        ))
                    ) : (
                        <div className="text-center w-full py-8 text-muted-foreground">
                            No Projects Found
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CreatedProjects
