/**
 * Pagination Component
 *
 * A reusable pagination component that allows users to navigate between pages.
 * It includes "Previous" and "Next" buttons, which are disabled based on the current page
 * and loading state. The component also displays the current page and total pages.
 */

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}) {
    const [isLoading, setIsLoading] = useState(false)

    const handlePrevious = () => {
        if (currentPage > 1 && !isLoading) {
            setIsLoading(true)
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages && !isLoading) {
            setIsLoading(true) // Disable buttons
            onPageChange(currentPage + 1)
        }
    }

    // Re-enable buttons after a short delay
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 300) // 300ms delay to prevent rapid clicks
            return () => clearTimeout(timer)
        }
    }, [isLoading])

    return (
        <div className="flex justify-between items-center mt-4">
            <Button
                onClick={handlePrevious}
                disabled={currentPage === 1 || isLoading} // Disable if loading or on first page
                variant="outline"
            >
                Previous
            </Button>
            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                onClick={handleNext}
                disabled={currentPage === totalPages || isLoading} // Disable if loading or on last page
                variant="outline"
            >
                Next
            </Button>
        </div>
    )
}
