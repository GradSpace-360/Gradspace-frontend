import { useState } from "react"
import { toast } from "react-hot-toast"
import * as yup from "yup"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User } from "@/store/admin/viewUpdateStore"

import { userApi } from "./ViewUpdateApi"

// Define the action schema using yup
const actionSchema = yup.object().shape({
    action: yup.string().required("Action is required"),
    reason: yup.string().when("action", {
        is: (action: string) => ["remove"].includes(action),
        then: (schema) => schema.required("Reason is required for this action"),
        otherwise: (schema) => schema,
    }),
})

export function UserDetailsModal({
    user,
    onClose,
}: {
    user: User
    onClose: () => void
}) {
    const [action, setAction] = useState<string>("")
    const [reason, setReason] = useState("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleAction = async () => {
        try {
            // Validate the action and reason using the schema
            await actionSchema.validate(
                { action, reason },
                { abortEarly: false }
            )
            setErrors({}) // Clear errors if validation succeeds

            // Handle role-specific actions
            if (action === "promote" && user.role === "Student") {
                await userApi.performAction(user.id, action, reason)
            } else if (action === "demote" && user.role === "Alumni") {
                await userApi.performAction(user.id, action, reason)
            } else if (["remove"].includes(action)) {
                await userApi.performAction(user.id, action, reason)
            } else {
                throw new Error("Invalid action for the current user role")
            }

            // Show a success toast
            toast.success(`Successfully ${action}ed user ${user.full_name}`)
            // Close the modal
            onClose()
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                // Handle Yup validation errors
                const validationErrors: { [key: string]: string } = {}
                error.inner.forEach((err) => {
                    if (err.path) {
                        validationErrors[err.path] = err.message
                    }
                })
                setErrors(validationErrors)
            } else {
                toast.error((error as Error).message)
            }
        }
    }

    return (
        <div className="m-4">
            <Dialog open={!!user} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[700px]">
                    <div>
                        <DialogHeader>
                            <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col sm:flex-row gap-6 py-4">
                            {/* User Details Section */}
                            <div className="space-y-2 max-w-[350px]">
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">Name:</span>
                                    <span>{user.full_name}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">Email:</span>
                                    <span> {user.email}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">Batch:</span>
                                    <span>{user.batch}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">
                                        Department:
                                    </span>
                                    <span>
                                        {user.department === "CSE"
                                            ? "Computer Science Engineering"
                                            : user.department === "ECE"
                                              ? "Electronics and Communication Engineering"
                                              : user.department === "ME"
                                                ? "Mechanical Engineering"
                                                : user.department === "EEE"
                                                  ? "Electrical and Electronics Engineering"
                                                  : user.department}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">Role:</span>
                                    <span>{user.role}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">Status:</span>
                                    <span>
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
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">
                                        Verification:
                                    </span>
                                    <span>
                                        <Badge
                                            variant={
                                                user.is_verified
                                                    ? "secondary"
                                                    : "destructive"
                                            }
                                        >
                                            {user.is_verified
                                                ? "Verified"
                                                : "Not Verified"}
                                        </Badge>
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-0">
                                    <span className="font-medium">
                                        Registration:
                                    </span>
                                    <span>
                                        <Badge
                                            variant={
                                                user.registration_status ===
                                                "registered"
                                                    ? "secondary"
                                                    : user.registration_status ===
                                                        "pending"
                                                      ? "outline"
                                                      : "destructive"
                                            }
                                        >
                                            {user.registration_status}
                                        </Badge>
                                    </span>
                                </div>
                            </div>
                            {/* Action Section */}
                            <div className="space-y-4 sm:border-l sm:ml-5 sm:pl-2 flex-1">
                                <h3 className="font-semibold text-lg">
                                    Actions
                                </h3>
                                <Select
                                    value={action}
                                    onValueChange={setAction}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="remove">
                                            Remove User
                                        </SelectItem>
                                        {user.role === "Student" && (
                                            <SelectItem value="promote">
                                                Promote to Alumni
                                            </SelectItem>
                                        )}
                                        {user.role === "Alumni" && (
                                            <SelectItem value="demote">
                                                Demote to Student
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.action && (
                                    <p className="text-sm text-red-500">
                                        {errors.action}
                                    </p>
                                )}
                                {["remove"].includes(action) && (
                                    <div>
                                        <Input
                                            placeholder="Reason for action"
                                            value={reason}
                                            onChange={(e) =>
                                                setReason(e.target.value)
                                            }
                                        />
                                        {errors.reason && (
                                            <p className="text-sm text-red-500">
                                                {errors.reason}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button onClick={handleAction} disabled={!action}>
                                Perform Action
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
