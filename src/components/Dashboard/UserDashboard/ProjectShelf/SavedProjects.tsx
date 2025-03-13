import { AnimatePresence, motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import { useEffect } from "react"

import { Pagination } from "@/components/Pagination"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useProjectStore } from "@/store/user/project_shelf"
import { Project } from "@/types/user/project_shelf"

import ProjectCard from "./ProjectCard"

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
}

const SavedProjects = () => {
    const {
        savedProjects,
        isLoading: loadingSavedProjects,
        fetchSavedProjects,
        savedProjectsPagination,
        setSavedProjectsPagination,
    } = useProjectStore()

    useEffect(() => {
        fetchSavedProjects()
    }, [fetchSavedProjects])

    const handlePageChange = (newPage: number) => {
        setSavedProjectsPagination({ page: newPage })
        fetchSavedProjects()
    }

    const totalPages = Math.ceil(
        savedProjectsPagination.total / savedProjectsPagination.limit
    )

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container max-w-7xl mx-auto px-4 py-8"
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="gradient-title font-bold text-3xl md:text-4xl font-philosopher text-center mb-12"
            >
                Saved Projects
            </motion.h1>

            {loadingSavedProjects && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="p-6">
                            <Skeleton className="h-48 w-full rounded-lg mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-6 w-20 rounded-full"
                                    />
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {!loadingSavedProjects && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {savedProjects?.length ? (
                            savedProjects.map((project: Project) => (
                                <motion.div
                                    key={project.id}
                                    variants={cardVariants}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProjectCard
                                        project={project}
                                        onProjectAction={fetchSavedProjects}
                                    />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full text-center py-12 space-y-4"
                            >
                                <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/40" />
                                <div className="text-2xl font-semibold text-muted-foreground">
                                    No projects saved yet
                                </div>
                                <p className="text-muted-foreground/60">
                                    Your saved projects will appear here
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 flex justify-center"
                >
                    <Pagination
                        currentPage={savedProjectsPagination.page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </motion.div>
            )}
        </motion.div>
    )
}

export default SavedProjects
