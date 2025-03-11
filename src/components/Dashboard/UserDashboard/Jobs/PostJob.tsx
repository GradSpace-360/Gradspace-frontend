import { zodResolver } from "@hookform/resolvers/zod"
import MDEditor from "@uiw/react-md-editor"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Navigate, useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useTheme } from "@/context/ThemProvider"
import { useAuthStore } from "@/store/auth"
import { useCompanyStore } from "@/store/user/company"
import { useJobStore } from "@/store/user/job"
import { Company } from "@/types/user/Job/company"

import AddCompanyDrawer from "./AddCompanyDrawer"

const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters" }),
    location: z.string().min(1, { message: "Location is required" }),
    company_id: z.string().min(1, { message: "Select or Add a new Company" }),
    requirements: z.string().min(1, { message: "Requirements are required" }),
    job_type: z.enum(["Part-Time", "Full-Time", "Internship", "Freelance"]),
    apply_link: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const PostJob = () => {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const { theme } = useTheme()
    const {
        companies,
        isLoading: loadingCompanies,
        fetchCompanies,
    } = useCompanyStore()
    const { isLoading: creatingJob, error: jobError, createJob } = useJobStore()
    const [companyCreated, setCompanyCreated] = useState(false)
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            location: "",
            company_id: "",
            requirements: "",
            job_type: "Full-Time",
            apply_link: "",
        },
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        fetchCompanies()
    }, [fetchCompanies])

    useEffect(() => {
        if (companyCreated) {
            fetchCompanies()
            setCompanyCreated(false)
        }
    }, [companyCreated, fetchCompanies])

    const onSubmit = async (data: FormData) => {
        try {
            await createJob({
                ...data,
                company_id: data.company_id,
                job_type: data.job_type,
                location: data.location,
                requirements: data.requirements,
                title: data.title,
                description: data.description,
                is_open: true,
                apply_link: data.apply_link || undefined,
            })
            toast.success("Job created successfully!")
            navigate("/dashboard/job-portal")
        } catch {
            toast.error("Failed to create job")

            // Error handling now done via toast
            // Error message is already displayed from store
        }
    }

    if (loadingCompanies) {
        return <BarLoader className="mb-4 w-full" color="#36d7b7" />
    }

    if (user?.role !== "Alumni" && user?.role !== "Faculty") {
        return <Navigate to="/dashboard/job-portal" />
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-4">
            <div className="space-y-2">
                <h1 className="font-bold text-2xl    font-philosopher whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Post Job Opportunity
                </h1>
                <p className="text-muted-foreground">
                    Fill in the details below to list a new job opening
                </p>
            </div>

            <Separator />

            <AddCompanyDrawer
                onCompanyCreated={() => setCompanyCreated(true)}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                            id="title"
                            placeholder="Senior Software Engineer"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Detailed job description..."
                            {...register("description")}
                            className="min-h-[120px]"
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Label>Location</Label>
                            <Input
                                placeholder="City, Country"
                                {...register("location")}
                            />
                            {errors.location && (
                                <p className="text-sm text-destructive">
                                    {errors.location.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <Label>Job Type</Label>
                            <Controller
                                name="job_type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {[
                                                    "Full-Time",
                                                    "Part-Time",
                                                    "Internship",
                                                    "Freelance",
                                                ].map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.job_type && (
                                <p className="text-sm text-destructive">
                                    {errors.job_type.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Label>Company</Label>
                            <div className="flex gap-2">
                                <Controller
                                    name="company_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select company" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {companies?.map(
                                                        (company: Company) => (
                                                            <SelectItem
                                                                key={company.ID}
                                                                value={
                                                                    company.ID
                                                                }
                                                            >
                                                                {company.Name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "add-company-trigger"
                                            )
                                            ?.click()
                                    }
                                >
                                    Add New
                                </Button>
                            </div>
                            {errors.company_id && (
                                <p className="text-sm text-destructive">
                                    {errors.company_id.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <Label htmlFor="apply_link">
                                Application Link (Optional)
                            </Label>
                            <Input
                                id="apply_link"
                                placeholder="https://company.com/apply"
                                {...register("apply_link")}
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Requirements & Skills</Label>
                        <Controller
                            name="requirements"
                            control={control}
                            render={({ field }) => (
                                <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    height={250}
                                    data-color-mode={
                                        theme === "dark" ? "dark" : "light"
                                    }
                                />
                            )}
                        />
                        {errors.requirements && (
                            <p className="text-sm text-destructive">
                                {errors.requirements.message}
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                    {jobError && (
                        <p className="text-sm text-destructive">{jobError}</p>
                    )}
                    {creatingJob && (
                        <BarLoader className="w-full" color="#36d7b7" />
                    )}
                    <Button type="submit" className="w-full" size="lg">
                        Publish Job
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PostJob
