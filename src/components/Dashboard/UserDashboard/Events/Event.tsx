import MDEditor from "@uiw/react-md-editor"
import { Calendar, DoorClosed, DoorOpen, Flag, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { NavLink, useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import { useEventStore } from "@/store/user/event"

type EventReportReason =
    | "inappropriateContent"
    | "Spam"
    | "Fake Event"
    | "Safety Concerns"

const EventPage = () => {
    const { id } = useParams<{ id: string }>()
    const {
        selectedEvent,
        updateEventStatus,
        setSelectedEvent,
        events,
        savedEvents,
        myEvents,
        isLoading,
        reportEvent,
        reportError,
    } = useEventStore()
    const { user } = useAuthStore()

    const [reportDialogOpen, setReportDialogOpen] = useState(false)

    useEffect(() => {
        if (!id) return
        const allEvents = [...events, ...savedEvents, ...myEvents]
        const foundEvent = allEvents.find((event) => event.id === id)
        if (foundEvent) {
            setSelectedEvent(foundEvent)
        } else {
            setSelectedEvent(null)
        }
    }, [id, events, savedEvents, myEvents, setSelectedEvent])

    const handleStatusChange = async (value: string) => {
        if (!id || !selectedEvent) return
        const isOpen = value === "open"
        try {
            await updateEventStatus(id, isOpen)
            setSelectedEvent({ ...selectedEvent, is_registration_open: isOpen })
        } catch (error) {
            console.error("Failed to update status:", error)
        }
    }

    const handleReportSubmit = async (reportReason: EventReportReason) => {
        if (!id || !reportReason) return
        try {
            await reportEvent(id, reportReason)
            toast.success("Thank you for your report. Our team will review it.")
        } catch {
            toast.error(reportError || "Failed to report event")
        } finally {
            setReportDialogOpen(false)
        }
    }
    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl p-4">
                <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
            </div>
        )
    }

    if (!selectedEvent) {
        return (
            <div className="mx-auto max-w-4xl p-4 text-center text-lg">
                Event not found
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                        <h1 className="text-xl font-bold tracking-tight md:text-4xl">
                            {selectedEvent.title}
                        </h1>
                        <div className="flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span className="text-muted-foreground">
                                {selectedEvent.venue}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {new Date(
                                    selectedEvent.start_date_time
                                ).toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}{" "}
                                -{" "}
                                {new Date(
                                    selectedEvent.end_date_time
                                ).toLocaleString("en-US", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Report button */}
                    {/* {user && selectedEvent.posted_by.id !== user.id && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-muted-foreground"
                            onClick={() => setReportDialogOpen(true)}
                        >
                            <Flag className="h-4 w-4" />
                            Report
                        </Button>
                    )} */}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge
                        variant={
                            selectedEvent.is_registration_open
                                ? "default"
                                : "destructive"
                        }
                        className="gap-2 px-3 py-1 text-sm"
                    >
                        {selectedEvent.is_registration_open ? (
                            <DoorOpen className="h-4 w-4" />
                        ) : (
                            <DoorClosed className="h-4 w-4" />
                        )}
                        <span>
                            {selectedEvent.is_registration_open
                                ? "Registration Open"
                                : "Registration Closed"}
                        </span>
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                        {selectedEvent.event_type}
                    </Badge>
                </div>
            </div>

            <Separator />

            {selectedEvent.posted_by.id === user?.id && (
                <div className="flex items-center justify-between rounded-lg bg-muted/40 p-4">
                    <div className="space-y-1">
                        <p className="font-medium">Manage Registration</p>
                        <p className="text-sm text-muted-foreground">
                            Update registration status
                        </p>
                    </div>
                    <Select
                        onValueChange={handleStatusChange}
                        value={
                            selectedEvent.is_registration_open
                                ? "open"
                                : "closed"
                        }
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            <section className="space-y-6">
                <div className="space-y-4">
                    {/* <h2 className="text-2xl font-semibold">Event Details</h2> */}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <MDEditor.Markdown
                            style={{
                                backgroundColor: "transparent",
                                color: "inherit",
                            }}
                            source={selectedEvent.description}
                        />
                    </div>
                </div>

                {selectedEvent.register_link && (
                    <>
                        <Separator />
                        <div className="space-y-1">
                            <Button asChild className="text-sm md:w-auto">
                                <a
                                    href={selectedEvent.register_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Register Now →
                                </a>
                            </Button>
                        </div>
                    </>
                )}
            </section>

            <Separator />

            <div className="flex w-full flex-col items-center justify-end">
                <NavLink
                    to={`/dashboard/profile/${selectedEvent.posted_by.username}`}
                    className="block w-full md:w-1/2"
                >
                    <div className="flex items-center gap-4 rounded-lg p-4 bg-muted/40">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={`${axiosPrivate.defaults.baseURL}/${selectedEvent.posted_by.profile_image}`}
                                alt={selectedEvent.posted_by.full_name}
                            />
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-medium">
                                {selectedEvent.posted_by.full_name}
                            </p>
                            <p className="text-muted-foreground">
                                Posted{" "}
                                {new Date(
                                    selectedEvent.created_at
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>
                </NavLink>
                {user && selectedEvent.posted_by.id !== user.id && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center w-32 m-4    gap-1 text-muted-foreground"
                        onClick={() => setReportDialogOpen(true)}
                    >
                        <Flag className="h-4 w-4" />
                        Report
                    </Button>
                )}
            </div>

            {/* Report Dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent
                    className="sm:max-w-[425px]"
                    showCloseButton={false}
                >
                    <DialogHeader>
                        <DialogTitle>Report Event</DialogTitle>
                        <DialogDescription>
                            Please select a reason for reporting this event.
                            Admin will review your report.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                                onClick={() =>
                                    handleReportSubmit("inappropriateContent")
                                }
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                Inappropriate Content
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                                onClick={() => handleReportSubmit("Spam")}
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                Spam
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                                onClick={() => handleReportSubmit("Fake Event")}
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                Fake Event
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                                onClick={() =>
                                    handleReportSubmit("Safety Concerns")
                                }
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                Safety Concerns
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setReportDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        {/* <Button
                            onClick={handleReportSubmit}
                            disabled={!reportReason || isReporting}
                        >
                            {isReporting ? "Submitting..." : "Submit Report"}
                        </Button> */}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EventPage
