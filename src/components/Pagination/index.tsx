/**
 * Pagination Component
 *
 * A reusable pagination component that allows users to navigate between pages.
 * It includes "Previous" and "Next" buttons, which are disabled based on the current page
 * and loading state. The component also displays the current page and total pages.
 */

import { useEffect, useRef, useState } from "react"

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
    const scrollDirection = useRef<"next" | "prev" | null>(null)
    const scrollPositions = useRef<{ [key: number]: number }>({})

    const handleScrollPosition = () => {
        // Save current scroll position before page change
        scrollPositions.current[currentPage] = window.scrollY
    }

    const handlePrevious = () => {
        if (currentPage > 1 && !isLoading) {
            handleScrollPosition()
            setIsLoading(true)
            scrollDirection.current = "prev"
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages && !isLoading) {
            handleScrollPosition()
            setIsLoading(true)
            scrollDirection.current = "next"
            onPageChange(currentPage + 1)
        }
    }

    useEffect(() => {
        if (scrollDirection.current === "next") {
            // Instant scroll to top without animation
            window.scrollTo(0, 0)
        } else if (scrollDirection.current === "prev") {
            // Restore previous page's scroll position
            const prevPosition =
                scrollPositions.current[currentPage] ||
                document.documentElement.scrollHeight
            window.scrollTo(0, prevPosition)
        }
        scrollDirection.current = null
    }, [currentPage])

    // Restore scroll position after render
    useEffect(() => {
        const savedPosition = scrollPositions.current[currentPage]
        if (savedPosition !== undefined) {
            window.scrollTo(0, savedPosition)
        }
    }, [currentPage])

    // Re-enable buttons after short delay
    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => setIsLoading(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isLoading])

    return (
        <div className="flex justify-between items-center mt-4">
            <Button
                onClick={handlePrevious}
                disabled={currentPage === 1 || isLoading}
                variant="outline"
            >
                Previous
            </Button>
            <span className="text-sm">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                onClick={handleNext}
                disabled={currentPage === totalPages || isLoading}
                variant="outline"
            >
                Next
            </Button>
        </div>
    )
}
