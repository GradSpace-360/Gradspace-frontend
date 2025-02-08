/**
 * View Users Component
 * This component provides a comprehensive interface for viewing and managing a list of users.
 * It combines filtering, table display, and pagination to create an efficient user management experience.
 * Features:
 * - Displays a list of users in a paginated table.
 * - Allows filtering users by:
 *   - Search keywords.
 *   - Batch year.
 *   - Department.
 *   - Role.
 * - Supports client-side pagination with controls to navigate between pages.
 * - Automatically fetches user data when filters or page changes occur.
 *
 * State Management:
 * - `users`: List of users fetched based on current filters and pagination.
 * - `filters`: Current filter criteria for search, batch, department, and role.
 * - `pagination`: Tracks current page, total pages, and limit per page.
 * - `loading`: Indicates whether the data is being fetched.
 * - Actions:
 *   - `fetchUsers`: Fetches the user data from the backend.
 *   - `setFilters`: Updates the current filters and resets the page to the first.
 *   - `setPagination`: Updates the pagination state.
 *   - `resetFilters`: Resets all filters to their default values.
 * Components:
 * - `UserFilters`: Provides filter inputs and actions for applying or resetting filters.
 * - `UserTable`: Displays the list of users in a structured table format.
 * - `Pagination`: Provides navigation controls for paginated data.
 */

import { useEffect } from "react"

import { Pagination } from "@/components/Pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUsersStore } from "@/store/admin/viewUpdateStore"

import { UserFilters } from "./UserFilters"
import { UserTable } from "./UserTable"

export default function ViewUsers() {
    const {
        users,
        pagination,
        filters,
        loading,
        fetchUsers,
        setFilters,
        setPagination,
        resetFilters,
    } = useUsersStore()

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers, filters, pagination.page])

    const handleFilterChange = (newFilters: {
        search: string
        batch: string
        department: string
        role: string
    }) => {
        setFilters(newFilters)
        setPagination({ ...pagination, page: 1 })
    }

    const handlePageChange = (newPage: number) => {
        setPagination({ ...pagination, page: newPage })
    }

    return (
        <Card className="w-full border-0 shadow-none">
            <CardHeader>
                <CardTitle>View Users</CardTitle>
            </CardHeader>
            <CardContent>
                <UserFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={resetFilters}
                />
                <div className="mb-4"></div>
                <UserTable users={users} loading={loading} />
                <Pagination
                    currentPage={pagination.page}
                    totalPages={Math.ceil(pagination.total / pagination.limit)}
                    onPageChange={handlePageChange}
                />
            </CardContent>
        </Card>
    )
}
