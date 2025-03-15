import { zodResolver } from "@hookform/resolvers/zod"
import { File, Github, Link2, Video, X } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Navigate, useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/auth"
import { useProjectStore } from "@/store/user/project_shelf"

const schema = z.object({
    title: z
        .string()
        .min(5, { message: "Title must be at least 5 characters" }),
    description: z
        .string()
        .min(20, { message: "Description must be at least 20 characters" }),
    tags: z
        .array(z.string().min(1))
        .min(1, { message: "At least one tag is required" }),
    project_type: z.enum(["PERSONAL", "GROUP", "COLLEGE"]),
    year: z.number().min(2000).max(new Date().getFullYear()),
    mentor: z.string().optional(),
    contributors: z
        .array(z.string().min(1))
        .min(1, { message: "At least one contributor is required" }),
    links: z.object({
        code_link: z.string().url().optional().or(z.literal("")),
        website: z.string().url().optional().or(z.literal("")),
        video: z.string().url().optional().or(z.literal("")),
        files: z.string().url().optional().or(z.literal("")),
    }),
    status: z.enum(["ACTIVE", "COMPLETED"]),
})

type FormData = z.infer<typeof schema>

const PostProject = () => {
    const { user } = useAuthStore()
    const {
        isLoading: creatingProject,
        error: projectError,
        createProject,
    } = useProjectStore()
    const navigate = useNavigate()
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
        setValue,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            project_type: "PERSONAL",
            status: "ACTIVE",
            tags: [],
            contributors: [],
            links: {
                code_link: "",
                website: "",
                video: "",
                files: "",
            },
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            await createProject({
                ...data,
                year: Number(data.year),
            })
            toast.success("Project created successfully!")
            navigate("/dashboard/projects")
        } catch (error) {
            toast.error("Failed to create project")
            console.error("Project creation failed:", error)
        }
    }

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const value = e.currentTarget.value.trim()
            if (value && !watch("tags").includes(value)) {
                setValue("tags", [...watch("tags"), value])
                e.currentTarget.value = ""
            }
        }
    }

    const handleAddContributor = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const value = e.currentTarget.value.trim()
            if (value && !watch("contributors").includes(value)) {
                setValue("contributors", [...watch("contributors"), value])
                e.currentTarget.value = ""
            }
        }
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-4">
            <div className="space-y-2">
                <h1 className="font-bold text-2xl font-philosopher whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Create New Project
                </h1>
                <p className="text-muted-foreground">
                    Share your project details with the community
                </p>
            </div>

            <Separator />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            placeholder="Advanced Image Recognition System"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">Project Description</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            Describe your project in detail including
                            objectives, technologies used, and key features.
                        </p>
                        <textarea
                            id="description"
                            {...register("description")}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[150px]"
                            placeholder="Example: This project aims to... We used... The main features include..."
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1 space-y-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2">
                                {watch("tags").map((tag, index) => (
                                    <Badge
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        {tag}
                                        <X
                                            size={14}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setValue(
                                                    "tags",
                                                    watch("tags").filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                        />
                                    </Badge>
                                ))}
                                <Input
                                    placeholder="Add tag (press Enter)"
                                    onKeyDown={handleAddTag}
                                />
                            </div>
                            {errors.tags && (
                                <p className="text-sm text-destructive">
                                    {errors.tags.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <Label>Project Type</Label>
                            <Controller
                                name="project_type"
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
                                            <SelectItem value="PERSONAL">
                                                Personal
                                            </SelectItem>
                                            <SelectItem value="GROUP">
                                                Group
                                            </SelectItem>
                                            <SelectItem value="COLLEGE">
                                                College
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Label>Year</Label>
                            <Input
                                type="number"
                                {...register("year", { valueAsNumber: true })}
                                min="2000"
                                max={new Date().getFullYear()}
                            />
                            {errors.year && (
                                <p className="text-sm text-destructive">
                                    {errors.year.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <Label>Status</Label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">
                                                Active
                                            </SelectItem>
                                            <SelectItem value="COMPLETED">
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Contributors</Label>
                        <div className="flex flex-wrap gap-2">
                            {watch("contributors").map((contributor, index) => (
                                <Badge
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    {contributor}
                                    <X
                                        size={14}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            setValue(
                                                "contributors",
                                                watch("contributors").filter(
                                                    (_, i) => i !== index
                                                )
                                            )
                                        }
                                    />
                                </Badge>
                            ))}
                            <Input
                                placeholder="Add contributor (press Enter)"
                                onKeyDown={handleAddContributor}
                            />
                        </div>
                        {errors.contributors && (
                            <p className="text-sm text-destructive">
                                {errors.contributors.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label>Mentor (Optional)</Label>
                        <Input
                            placeholder="Mentor's name"
                            {...register("mentor")}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Project Links</h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <Github className="h-5 w-5" />
                                <Input
                                    placeholder="Code repository URL"
                                    {...register("links.code_link")}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Link2 className="h-5 w-5" />
                                <Input
                                    placeholder="Live website URL"
                                    {...register("links.website")}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Video className="h-5 w-5" />
                                <Input
                                    placeholder="Demo video URL"
                                    {...register("links.video")}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <File className="h-5 w-5" />
                                <Input
                                    placeholder="Project files URL"
                                    {...register("links.files")}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                    {projectError && (
                        <p className="text-sm text-destructive">
                            {projectError}
                        </p>
                    )}
                    {creatingProject && (
                        <BarLoader className="w-full" color="#36d7b7" />
                    )}
                    <Button type="submit" className="w-full" size="lg">
                        Publish Project
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PostProject
