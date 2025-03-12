import { Heart, MapPinIcon, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { BarLoader } from "react-spinners"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { axiosPrivate } from "@/config/axiosInstance"
import { useAuthStore } from "@/store/auth"
import { useJobStore } from "@/store/user/job"
import { Job } from "@/types/user/Job/job"

interface JobCardProps {
    job: Job
    savedInit?: boolean
    onJobAction?: () => void
    isMyJob?: boolean
}

const JobCard: React.FC<JobCardProps> = ({
    job,
    savedInit = job.is_saved || false, // Initialize from backend
    onJobAction = () => {},
    isMyJob = false,
}) => {
    const [saved, setSaved] = useState(savedInit)
    console.log(saved)
    const { user } = useAuthStore()
    const { saveJob, deleteJob, isLoading, setSelectedJob, selectedJob } =
        useJobStore()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const handleSaveJob = async () => {
        if (!user) return
        await saveJob(job.id)
        onJobAction()
        setSaved(true)
    }
    useEffect(() => {
        setSaved(savedInit)
    }, [savedInit])

    useEffect(() => {
        console.log(selectedJob)
    }, [selectedJob])

    const confirmDelete = async () => {
        await deleteJob(job.id)
        onJobAction()
        setShowDeleteDialog(false)
    }

    return (
        <>
            <Card className="flex flex-col rounded-md">
                {isLoading && (
                    <BarLoader
                        className="mt-4"
                        width={"100%"}
                        color="#36d7b7"
                    />
                )}
                <CardHeader className="flex">
                    <CardTitle className="flex justify-between font-bold">
                        {job.title}
                        {isMyJob && (
                            <Trash2
                                size={18}
                                className="text-red-300 cursor-pointer hover:text-red-500"
                                onClick={() => setShowDeleteDialog(true)}
                            />
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                    <div className="flex justify-between">
                        {job.company && (
                            <img
                                src={`${axiosPrivate.defaults.baseURL}/${job.company.logo_url}`}
                                className="h-6"
                                alt={job.company.name}
                            />
                        )}
                        <div className="flex gap-2 items-center">
                            <MapPinIcon size={15} /> {job.location}
                        </div>
                    </div>
                    <hr />
                    <p>
                        {job.description.length > 150
                            ? job.description.substring(0, 150) + "..."
                            : job.description}
                    </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Link
                        to={`/dashboard/job/${job.id}`}
                        className="flex-1"
                        onClick={() => setSelectedJob(job)}
                    >
                        <Button variant="secondary" className="w-full">
                            More Details
                        </Button>
                    </Link>
                    {!isMyJob && (
                        <Button
                            variant="outline"
                            className="w-15"
                            onClick={handleSaveJob}
                            disabled={isLoading}
                        >
                            {job.is_saved ? (
                                <Heart size={20} fill="red" stroke="red" />
                            ) : (
                                <Heart size={20} />
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
            {showDeleteDialog && (
                <Dialog
                    open
                    onOpenChange={(open) => !open && setShowDeleteDialog(false)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Confirmation</DialogTitle>
                        </DialogHeader>
                        <p className="py-4">
                            This action cannot be undone. Are you sure you want
                            to delete this job?
                        </p>
                        <DialogFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}

export default JobCard
