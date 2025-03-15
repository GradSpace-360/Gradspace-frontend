import MDEditor from "@uiw/react-md-editor"
import { DoorClosed, DoorOpen, MapPinIcon } from "lucide-react"
import { useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { axiosPrivate } from "@/config/axiosInstance"
import { useAuthStore } from "@/store/auth"
import { useJobStore } from "@/store/user/job"

const JobPage = () => {
    const { id } = useParams<{ id: string }>()
    // Job store hooks
    const {
        selectedJob,
        updateJobStatus,
        setSelectedJob,
        jobs,
        savedJobs,
        myJobs,
        isLoading,
    } = useJobStore()
    const { user } = useAuthStore()

    useEffect(() => {
        if (!id) return

        // Find job in all job arrays
        const allJobs = [...jobs, ...savedJobs, ...myJobs]
        const foundJob = allJobs.find((job) => job.id === id)

        if (foundJob) {
            setSelectedJob(foundJob)
            console.log("foundJob", foundJob)
        } else {
            setSelectedJob(null)
        }
    }, [id, jobs, savedJobs, myJobs, setSelectedJob])

    const handleStatusChange = async (value: string) => {
        if (!id || !selectedJob) return

        const isOpen = value === "open"
        try {
            await updateJobStatus(id, isOpen)
            // Update local selectedJob state
            setSelectedJob({ ...selectedJob, is_open: isOpen })
        } catch (error) {
            console.error("Failed to update job status:", error)
        }
    }

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl p-4">
                <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            </div>
        )
    }

    if (!selectedJob) {
        return (
            <div className="mx-auto max-w-4xl p-4 text-center text-lg">
                Job not found
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                            {selectedJob.title}
                        </h1>
                        <div className="flex items-center gap-2 text-lg">
                            <MapPinIcon className="h-5 w-5 text-primary" />
                            <span className="text-muted-foreground">
                                {selectedJob.location}
                            </span>
                        </div>
                    </div>
                    <Avatar className="h-14 w-14  md:h-24 md:w-24">
                        <AvatarImage
                            src={`${axiosPrivate.defaults.baseURL}/${selectedJob.company.logo_url}`}
                            alt={selectedJob.title}
                        />
                    </Avatar>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge
                        variant={
                            selectedJob.is_open ? "default" : "destructive"
                        }
                        className="gap-2 px-3 py-1 text-sm"
                    >
                        {selectedJob.is_open ? (
                            <DoorOpen className="h-4 w-4" />
                        ) : (
                            <DoorClosed className="h-4 w-4" />
                        )}
                        <span>
                            {selectedJob.is_open
                                ? "Hiring Active"
                                : "Position Closed"}
                        </span>
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                        {selectedJob.job_type}
                    </Badge>
                </div>
            </div>

            <Separator />

            {/* Status Update for Employers */}
            {selectedJob.posted_by.id === user?.id && (
                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                    <div className="space-y-1">
                        <p className="font-medium">Manage this position</p>
                        <p className="text-sm text-muted-foreground">
                            Update hiring status for applicants
                        </p>
                    </div>
                    <Select
                        onValueChange={handleStatusChange}
                        value={selectedJob.is_open ? "open" : "closed"}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Main Content Sections */}
            <section className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">About the Role</h2>
                    <p className="leading-relaxed text-muted-foreground">
                        {selectedJob.description}
                    </p>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Requirements</h2>
                    <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border p-4">
                        <MDEditor.Markdown
                            style={{
                                backgroundColor: "transparent",
                                color: "inherit",
                            }}
                            source={selectedJob.requirements}
                        />
                    </div>
                </div>

                {selectedJob.apply_link && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">
                                Ready to Apply?
                            </h2>
                            <Button
                                asChild
                                className="w-full gap-2 py-6 text-lg md:w-auto"
                            >
                                <a
                                    href={selectedJob.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Apply Now →
                                </a>
                            </Button>
                        </div>
                    </>
                )}
            </section>

            {/* Meta Information */}
            <Separator />

            <div className="flex w-full justify-end">
                <NavLink
                    to={`/dashboard/profile/${selectedJob.posted_by.username}`}
                    className="block w-full md:w-1/2"
                >
                    <div className="flex items-center gap-4 rounded-lg p-4 bg-muted/40 ">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={`${axiosPrivate.defaults.baseURL}/${selectedJob.posted_by.profile_image}`}
                                alt={selectedJob.posted_by.full_name}
                            />
                        </Avatar>

                        <div className="space-y-1">
                            <p className="font-medium">
                                {selectedJob.posted_by.full_name}
                            </p>
                            <p className="text-muted-foreground">
                                Posted{" "}
                                {new Date(
                                    selectedJob.created_at as string
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default JobPage
