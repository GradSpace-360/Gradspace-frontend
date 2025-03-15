import { useEffect } from "react"

import { Pagination } from "@/components/Pagination"
import JobLoadingSkeleton from "@/skeletons/JobLoadingSkeleton"
import { useProjectStore } from "@/store/user/project_shelf"

import CreatedProjects from "./CreatedProjects"

const MyProjects = () => {
    const {
        myProjects,
        myProjectsPagination,
        fetchMyProjects,
        setMyProjectsPagination,
        isLoading: loadingProjects,
    } = useProjectStore()

    useEffect(() => {
        fetchMyProjects()
    }, [fetchMyProjects])

    const handlePageChange = (newPage: number) => {
        setMyProjectsPagination({ page: newPage })
        fetchMyProjects()
    }

    const totalPages = Math.ceil(
        myProjectsPagination.total / myProjectsPagination.limit
    )

    if (loadingProjects) {
        return (
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                    <JobLoadingSkeleton key={index} />
                ))}
            </div>
        )
    }

    return (
        <div className="mt-8 px-6 mb-6">
            <h1 className="gradient-title font-extrabold text-xl sm:text-4xl font-philosopher text-center">
                My Projects
            </h1>
            <CreatedProjects projects={myProjects} />
            <Pagination
                currentPage={myProjectsPagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default MyProjects
