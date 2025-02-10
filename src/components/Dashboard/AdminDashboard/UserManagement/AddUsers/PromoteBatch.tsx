/**
 * PromoteBatch Component
 * This component allows administrators to promote a specific batch of students to alumni status.
 * Alumni gain access to exclusive features such as posting job opportunities, searching for candidates,
 * and accessing alumni-exclusive resources.
 * Features:
 * - Validates the batch year input using Yup schema validation.
 * - Disables the "Promote" button if the input is invalid or empty.
 * - Displays a confirmation dialog before proceeding with the promotion.
 * - Handles form submission and API calls to promote the batch.
 * Validation Rules:
 * - Batch must be a number.
 * - Batch is required.
 * - Batch must be 1995 or later.
 * - Batch must be no later than 3 years before the current year.
 */

import { yupResolver } from "@hookform/resolvers/yup"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as yup from "yup"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { axiosPrivate } from "@/config/axiosInstance"

// Yup schema for validation
const schema = yup.object().shape({
    batch: yup
        .number()
        .typeError("Batch must be a number")
        .required("Batch is required")
        .min(1995, "Batch must be 1995 or later")
        .max(
            new Date().getFullYear() - 3,
            `Batch must be ${new Date().getFullYear() - 3} or earlier`
        )
        .nullable(), // Allow `null` values
})

const PromoteBatch: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        trigger,
    } = useForm<{ batch: number | null }>({
        resolver: yupResolver(schema),
        defaultValues: {
            batch: new Date().getFullYear() - 3,
        },
        mode: "onChange", // Validate on every change
    })

    // Watch the `batch` field value
    const batchValue = watch("batch")

    const onSubmit = async (data: { batch: number | null }) => {
        try {
            if (data.batch !== null) {
                await axiosPrivate.post(
                    "/admin/user-management/promote-batch/",
                    {
                        batch: data.batch,
                    }
                )
                toast.success("Batch promoted successfully")
            }
        } catch (error) {
            console.error("Failed to promote batch:", error)
            toast.error("Failed to promote batch")
        }
    }

    const handleProceed = async () => {
        const isValid = await trigger()
        if (isValid) {
            handleSubmit(onSubmit)()
        }
    }

    // Disable the "Promote" button if the field is empty or invalid
    const isPromoteButtonDisabled =
        !isValid || batchValue === null || batchValue === undefined

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-gray-100 dark:bg-[#262626] p-4 rounded-md">
                <h3 className="font-semibold mb-2">Promote Batch to Alumni</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    This feature allows you to promote all students from a
                    specific batch to alumni status. Once promoted, alumni gain
                    access to exclusive features such as:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <li>Posting job opportunities and events.</li>
                    <li>Searching for candidates and providing referrals.</li>
                    <li>
                        Accessing alumni-exclusive resources and networking
                        opportunities.
                    </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Note:</strong> This action cannot be undone. Please
                    ensure the batch year is correct before proceeding.
                </p>
            </div>
            <div>
                <Controller
                    name="batch"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder="Batch"
                            value={field.value === null ? "" : field.value} // Handle null value
                            onChange={(e) => {
                                const value = e.target.value
                                const newValue =
                                    value === "" ? null : parseInt(value, 10)
                                field.onChange(newValue)
                                trigger("batch") // Trigger validation on change
                            }}
                            onKeyDown={(e) => {
                                // Prevent non-numeric input
                                if (
                                    !(
                                        e.key === "Backspace" ||
                                        e.key === "Delete" ||
                                        e.key === "Tab" ||
                                        e.key === "Escape" ||
                                        e.key === "Enter" ||
                                        /[0-9]/.test(e.key)
                                    )
                                ) {
                                    e.preventDefault()
                                }
                            }}
                            onPaste={(e) => {
                                // Prevent pasting non-numeric values
                                const pasteData =
                                    e.clipboardData.getData("text")
                                if (!/^\d+$/.test(pasteData)) {
                                    e.preventDefault()
                                }
                            }}
                        />
                    )}
                />
                {errors.batch && (
                    <p className="text-red-500 text-sm">
                        {errors.batch.message}
                    </p>
                )}
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button type="button" disabled={isPromoteButtonDisabled}>
                        Promote
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will promote all students in the
                            specified batch to alumni. Alumni will gain access
                            to exclusive features, and this action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleProceed}>
                            Proceed
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </form>
    )
}

export default PromoteBatch
