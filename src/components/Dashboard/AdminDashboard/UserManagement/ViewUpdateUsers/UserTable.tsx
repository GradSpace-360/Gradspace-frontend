import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { TableSkeleton } from "@/skeletons"

import { UserDetailsModal } from "./UserDetailsModal"

interface User {
    id: string
    full_name: string
    batch: string
    department: string
    email: string
    role: string
    status: boolean
    is_verified: boolean
    registration_status: string
}

interface UserTableProps {
    users: User[]
    loading: boolean
}

export function UserTable({ users, loading }: UserTableProps) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    if (loading) {
        return <TableSkeleton columns={8} />
    }

    return (
        <TooltipProvider>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Verification</TableHead>
                            <TableHead>Registration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <Tooltip key={user.id}>
                                <TooltipTrigger asChild>
                                    <TableRow
                                        onClick={() => setSelectedUser(user)}
                                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    >
                                        <TableCell className="truncate">
                                            {user.full_name}
                                        </TableCell>
                                        <TableCell>{user.batch}</TableCell>
                                        <TableCell className="truncate">
                                            {user.department === "CSE"
                                                ? "Computer Science Engineering"
                                                : user.department === "ECE"
                                                  ? "Electronics and Communication Engineering"
                                                  : user.department === "ME"
                                                    ? "Mechanical Engineering"
                                                    : user.department === "EEE"
                                                      ? "Electrical and Electronics Engineering"
                                                      : user.department}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.status
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {user.status
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="truncate">
                                            <Badge
                                                variant={
                                                    user.is_verified
                                                        ? "default"
                                                        : "destructive"
                                                }
                                            >
                                                {user.is_verified
                                                    ? "Verified"
                                                    : "Not Verified"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    user.registration_status ===
                                                    "registered"
                                                        ? "default"
                                                        : user.registration_status ===
                                                            "pending"
                                                          ? "secondary"
                                                          : "destructive"
                                                }
                                            >
                                                {user.registration_status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Click to view details</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                />
            )}
        </TooltipProvider>
    )
}
