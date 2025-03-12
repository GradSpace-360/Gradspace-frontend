import { Calendar, Heart, MapPin, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
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
import { useEventStore } from "@/store/user/event"
import { Event } from "@/types/user/event"

interface EventCardProps {
    event: Event
    onEventAction?: () => void
    isMyEvent?: boolean
}

const EventCard = ({
    event,
    onEventAction = () => {},
    isMyEvent = false,
}: EventCardProps) => {
    const { saveEvent, deleteEvent, isLoading, setSelectedEvent } =
        useEventStore()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const handleSave = async () => {
        await saveEvent(event.id)
        onEventAction()
    }

    const confirmDelete = async () => {
        await deleteEvent(event.id)
        onEventAction()
        setShowDeleteDialog(false)
    }

    return (
        <>
            <Card className="flex flex-col rounded-lg">
                <CardHeader className="flex">
                    <CardTitle className="flex justify-between font-bold">
                        {event.title}
                        {isMyEvent && (
                            <Trash2
                                size={18}
                                className="text-red-300 cursor-pointer hover:text-red-500"
                                onClick={() => setShowDeleteDialog(true)}
                            />
                        )}
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin size={16} />
                        <span>{event.venue}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} />
                        <div className="flex flex-row gap-2">
                            {(() => {
                                const start = new Date(event.start_date_time)
                                const end = new Date(event.end_date_time)
                                const sameDay =
                                    start.toDateString() === end.toDateString()
                                if (sameDay) {
                                    return (
                                        <div className="flex flex-col">
                                            <span className="font-semibold">
                                                {start.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {start.toLocaleTimeString(
                                                    undefined,
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}{" "}
                                                -{" "}
                                                {end.toLocaleTimeString(
                                                    undefined,
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    }
                                                )}
                                            </span>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {start.toLocaleDateString(
                                                        undefined,
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {start.toLocaleTimeString(
                                                        undefined,
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold">
                                                    {end.toLocaleDateString(
                                                        undefined,
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {end.toLocaleTimeString(
                                                        undefined,
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        </>
                                    )
                                }
                            })()}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Badge
                            variant={
                                event.is_registration_open
                                    ? "default"
                                    : "destructive"
                            }
                        >
                            {event.is_registration_open ? "Open" : "Closed"}
                        </Badge>
                        <Badge variant="outline">{event.event_type}</Badge>
                    </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                    <Link
                        to={`/dashboard/event/${event.id}`}
                        className="flex-1"
                        onClick={() => setSelectedEvent(event)}
                    >
                        <Button variant="secondary" className="w-full">
                            Details
                        </Button>
                    </Link>

                    {!isMyEvent && (
                        <Button
                            variant="outline"
                            onClick={handleSave}
                            disabled={isLoading}
                        >
                            <Heart
                                size={20}
                                fill={event.is_saved ? "red" : "none"}
                            />
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
                            to delete this event?
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

export default EventCard
