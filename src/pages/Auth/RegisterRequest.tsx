// src/components/RegisterRequest.tsx

import axios from "axios"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import onBoardImg from "@/assets/3d-casual-life-young-woman-at-work-with-laptop-and-writing-min.png"
import DotBackground from "@/components/DotBackground"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import ManualVerificationPending from "./ManualVerificationPending"

// Define types directly in the component file
interface RegisterRequestFormData {
    fullname: string
    department: string
    batch: string
    email: string
    phone_number: string
    job: string
}

type RegistrationStatus = "registered" | "not_registered" | "pending"

export default function RegisterRequest() {
    /*
    from authStore.ts take registeraionStatus.
    on the login module wrapped by protectedRoute,
    it check isVerified, RegistrationStatus, and isOnboarded.
    RegistrationStatus is is not_registered or pending, it will redirect to /register-request

    */

    // hardcode the registration status to "not_registered" for now
    const [registrationStatus, setRegistrationStatus] =
        useState<RegistrationStatus>("not_registered")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterRequestFormData>()

    // Utility function: Submit the registration request
    const submitRegistrationRequest = async (
        data: RegisterRequestFormData
    ): Promise<void> => {
        try {
            console.log("Submitting registration request:", data)
            const response = await axios.post("/api/register-request", data)
            if (response.status === 200) {
                toast.success(
                    "Thank you for your registration request. Within 2 working days, we will verify your profile and inform you so you can proceed to the onboarding process."
                )
            }
        } catch (error) {
            toast.error(
                "Failed to submit the registration request. Please try again."
            )
            throw error
        }
    }

    // Handle form submission
    const onSubmit = async (data: RegisterRequestFormData) => {
        try {
            await submitRegistrationRequest(data)
            setRegistrationStatus("pending") // Update status to "pending" after successful submission
        } catch (error) {
            console.error("Error submitting registration request:", error)
        }
    }

    // Display processing message if the request is pending
    if (registrationStatus === "pending") {
        return <ManualVerificationPending />
    }

    // Render the registration form
    return (
        <div className="min-h-screen flex">
            <DotBackground />
            <div className="hidden lg:flex flex-col items-center justify-center p-8 w-1/2 fixed h-screen">
                <div className="max-w-md text-center">
                    <div className="relative w-full aspect-[4/3] mb-8">
                        <img
                            src={onBoardImg}
                            alt="Onboarding illustration"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-4xl font-philosopher font-bold tracking-tight mb-4 text-primary">
                        Join the{" "}
                        <span className="text-violet-600 dark:text-violet-600">
                            gradSpace
                        </span>{" "}
                        Community
                    </h1>
                    <p className="text-muted-foreground">
                        Your journey to professional success starts here.
                        Complete your registration to connect with alumni,
                        explore opportunities, and build your future. Let’s get
                        started!
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-auto lg:ml-[50%]">
                <div className="max-w-2xl mx-auto p-2 lg:p-6">
                    <div className="rounded-lg pt-5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-philosopher font-bold text-primary">
                                        Register Request
                                    </h2>
                                    <p className="text-muted-foreground">
                                        Please fill out the form to request
                                        access to the platform.
                                    </p>
                                </div>

                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-4"
                                >
                                    <Card>
                                        <CardContent className="space-y-4 pt-6">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="fullname"
                                                    className="block text-sm font-medium"
                                                >
                                                    Full Name
                                                </label>
                                                <Input
                                                    id="fullname"
                                                    placeholder="e.g. John Doe"
                                                    {...register("fullname", {
                                                        required:
                                                            "Full name is required",
                                                    })}
                                                />
                                                {errors.fullname && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.fullname
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="department"
                                                    className="block text-sm font-medium"
                                                >
                                                    Department
                                                </label>
                                                <Input
                                                    id="department"
                                                    placeholder="e.g. Computer Science"
                                                    {...register("department", {
                                                        required:
                                                            "Department is required",
                                                    })}
                                                />
                                                {errors.department && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.department
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="batch"
                                                    className="block text-sm font-medium"
                                                >
                                                    Batch
                                                </label>
                                                <Input
                                                    id="batch"
                                                    placeholder="e.g. 2015"
                                                    {...register("batch", {
                                                        required:
                                                            "Batch is required",
                                                    })}
                                                />
                                                {errors.batch && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.batch.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium"
                                                >
                                                    Email
                                                </label>
                                                <Input
                                                    id="email"
                                                    placeholder="e.g. john.doe@example.com"
                                                    {...register("email", {
                                                        required:
                                                            "Email is required",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message:
                                                                "Invalid email address",
                                                        },
                                                    })}
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.email.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="phone_number"
                                                    className="block text-sm font-medium"
                                                >
                                                    Phone Number
                                                </label>
                                                <Input
                                                    id="phone_number"
                                                    placeholder="e.g. +1234567890"
                                                    {...register(
                                                        "phone_number",
                                                        {
                                                            required:
                                                                "Phone number is required",
                                                            pattern: {
                                                                value: /^\+?[0-9]{10,15}$/,
                                                                message:
                                                                    "Invalid phone number",
                                                            },
                                                        }
                                                    )}
                                                />
                                                {errors.phone_number && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.phone_number
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="job"
                                                    className="block text-sm font-medium"
                                                >
                                                    Job Title
                                                </label>
                                                <Input
                                                    id="job"
                                                    placeholder="e.g. Software Engineer"
                                                    {...register("job", {
                                                        required:
                                                            "Job title is required",
                                                    })}
                                                />
                                                {errors.job && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.job.message}
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-center">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? "Submitting..."
                                                : "Submit Request"}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
