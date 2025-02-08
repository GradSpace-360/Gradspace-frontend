/**
 * RequestManagementPage.tsx
 *
 * This component represents the Request Management page in the Admin Dashboard.
 * It displays a table of pending user requests and includes pagination functionality.
 *
 * Dependencies:
 * - React's `useEffect` for side effects (fetching requests when the page changes).
 * - `UserRequestTable` component to display the table of pending requests.
 * - `Pagination` component to handle pagination controls.
 * - `Card`, `CardHeader`, `CardTitle`, and `CardContent` components from shadcn/ui for layout and styling.
 * - `useUserRequestsStore` from the global store to manage request data and pagination state.
 *
 * Functionality:
 * - Fetches user requests when the component mounts or when the pagination page changes.
 * - Updates the pagination state when the user navigates to a different page.
 * - Displays the total number of pages based on the total requests and the limit per page.
 *
 * Props: None
 *
 * State Management:
 * - Uses `useUserRequestsStore` to access and update the pagination state and fetch requests.
 */

import { useEffect } from "react"

import { UserRequestTable } from "@/components/Dashboard/AdminDashboard/RequestManagement/UserRequestTable"
import { Pagination } from "@/components/Pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Import shadcn/ui Card components
import { useUserRequestsStore } from "@/store/admin/userRequestsStore"

export function RequestManagementPage() {
    const { pagination, fetchRequests, setPagination } = useUserRequestsStore()

    useEffect(() => {
        fetchRequests()
    }, [pagination.page, fetchRequests])

    const handlePageChange = (page: number) => {
        setPagination({ page })
    }

    return (
        <div className="p-2  md:p-2">
            <Card className="border-0 shadow-none">
                <CardHeader>
                    <CardTitle>Pending Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <UserRequestTable />
                    <div className="mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={Math.ceil(
                                pagination.total / pagination.limit
                            )}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
