import { useState } from "react"
import { PulseLoader } from "react-spinners"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTheme } from "@/context/ThemProvider"
import { TableSkeleton } from "@/skeletons"
import { useUserRequestsStore } from "@/store/admin/userRequestsStore"

export function UserRequestTable() {
    const { requests, loading, approveRequest, rejectRequest } =
        useUserRequestsStore()

    const { theme } = useTheme()

    const [loadingStates, setLoadingStates] = useState<{
        [requestId: string]: { approve: boolean; reject: boolean }
    }>({})

    const handleApproveRequest = async (requestId: string) => {
        setLoadingStates((prev) => ({
            ...prev,
            [requestId]: { ...prev[requestId], approve: true },
        }))
        await approveRequest(requestId)
        setLoadingStates((prev) => ({
            ...prev,
            [requestId]: { ...prev[requestId], approve: false },
        }))
    }

    const handleRejectRequest = async (requestId: string) => {
        setLoadingStates((prev) => ({
            ...prev,
            [requestId]: { ...prev[requestId], reject: true },
        }))
        await rejectRequest(requestId)
        setLoadingStates((prev) => ({
            ...prev,
            [requestId]: { ...prev[requestId], reject: false },
        }))
    }

    if (loading) {
        return <TableSkeleton rows={14} columns={8} />
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Requested Date</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={8}
                                className="text-center h-24 text-muted-foreground"
                            >
                                No user requests found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        requests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.full_name}</TableCell>
                                <TableCell>{request.department}</TableCell>
                                <TableCell>{request.batch}</TableCell>
                                <TableCell>{request.email}</TableCell>
                                <TableCell>{request.phone_number}</TableCell>
                                <TableCell>{request.role}</TableCell>
                                <TableCell>
                                    {new Date(
                                        request.created_at
                                    ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {/* Approve Button */}
                                        <Button
                                            className="h-7 relative flex items-center justify-center min-w-[80px]"
                                            variant="default"
                                            onClick={() =>
                                                handleApproveRequest(request.id)
                                            }
                                            disabled={
                                                loadingStates[request.id]
                                                    ?.approve
                                            }
                                        >
                                            {/* Show "Approve" text when not loading */}
                                            {!loadingStates[request.id]
                                                ?.approve && (
                                                <span>Approve</span>
                                            )}

                                            {/* Show PulseLoader when loading */}
                                            {loadingStates[request.id]
                                                ?.approve && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <PulseLoader
                                                        size={8}
                                                        color={
                                                            theme === "dark"
                                                                ? "#000000"
                                                                : "#ffffff"
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </Button>

                                        {/* Reject Button */}
                                        <Button
                                            className="h-7 relative flex items-center justify-center min-w-[80px]"
                                            variant="destructive"
                                            onClick={() =>
                                                handleRejectRequest(request.id)
                                            }
                                            disabled={
                                                loadingStates[request.id]
                                                    ?.reject
                                            }
                                        >
                                            {/* Show "Reject" text when not loading */}
                                            {!loadingStates[request.id]
                                                ?.reject && <span>Reject</span>}

                                            {/* Show PulseLoader when loading */}
                                            {loadingStates[request.id]
                                                ?.reject && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <PulseLoader
                                                        size={8}
                                                        color="#ffffff"
                                                    />
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
