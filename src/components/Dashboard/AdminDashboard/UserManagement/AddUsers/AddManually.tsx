/**
 * AddManually Component
 *
 * This component provides a form to manually add a single user (student, alumni, or faculty) to the system.
 * It uses `react-hook-form` for form management and `yup` for validation. The form includes fields for:
 * - Full Name
 * - Batch (year, validated to be between 1995 and the current year)
 * - Department (CSE, EEE, ECE, ME)
 * - Role (Student, Alumni, Faculty)
 * - Email

 */
import { yupResolver } from "@hookform/resolvers/yup"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as yup from "yup"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { axiosPrivate } from "@/config/axiosInstance"
import { User } from "@/types/admin/AddUser"

// Define the department options with their full forms
const departmentOptions = [
    { value: "CSE", label: "Computer Science Engineering" },
    { value: "EEE", label: "Electrical and Electronics Engineering" },
    { value: "ECE", label: "Electronics and Communication Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
]

const schema = yup.object().shape({
    fullName: yup.string().required("Full Name is required"),
    batch: yup
        .number()
        .typeError("Batch must be a number")
        .required("Batch is required")
        .min(1995, "Batch must be 1995 or later")
        .max(
            new Date().getFullYear(),
            `Batch must be ${new Date().getFullYear()} or earlier`
        ),
    department: yup
        .string()
        .oneOf(["CSE", "EEE", "ECE", "ME"], "Invalid department")
        .required("Department is required"),
    role: yup
        .string()
        .oneOf(["Student", "Alumni", "Faculty"], "Invalid role")
        .required("Role is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
})

const AddManually: React.FC = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<User>({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: "",
            batch: new Date().getFullYear(),
            department: "CSE",
            role: "Student",
            email: "",
        },
    })

    const onSubmit = async (data: User) => {
        try {
            // Find the full form of the selected department
            const selectedDepartment = departmentOptions.find(
                (dept) => dept.value === data.department
            )

            // Prepare the user data with the full form of the department
            const userData = {
                ...data,
                department: selectedDepartment?.label || data.department, // Fallback to the value if not found
            }

            await axiosPrivate.post("/admin/user-management/add-users/", [
                userData,
            ])
            toast.success("User added successfully")
            reset()
        } catch {
            toast.error("Failed to add user")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="bg-gray-100 dark:bg-[#262626] p-4 rounded-md">
                <h3 className="font-semibold mb-2">Add User Manually</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    This feature allows you to add individual users (students,
                    alumni, or faculty) to the system manually. Use this form to
                    input user details, ensuring all fields are filled
                    correctly.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>For bulk user registration:</strong> Use the{" "}
                    <strong>Add via Excel</strong>
                    feature to upload multiple users at once.
                </p>
            </div>
            <div>
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Full Name" />
                    )}
                />
                {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.fullName.message}
                    </p>
                )}
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
                            value={field.value}
                            onChange={(e) =>
                                field.onChange(Number(e.target.value))
                            }
                        />
                    )}
                />
                {errors.batch && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.batch.message}
                    </p>
                )}
            </div>
            <div>
                <Controller
                    name="department"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departmentOptions.map((dept) => (
                                    <SelectItem
                                        key={dept.value}
                                        value={dept.value}
                                    >
                                        {dept.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.department && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.department.message}
                    </p>
                )}
            </div>
            <div>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Alumni">Alumni</SelectItem>
                                <SelectItem value="Faculty">Faculty</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                    </p>
                )}
            </div>
            <div>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input {...field} type="email" placeholder="Email" />
                    )}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                    </p>
                )}
            </div>
            <Button type="submit">Submit</Button>
        </form>
    )
}

export default AddManually
