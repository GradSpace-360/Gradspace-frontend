"use client"

import MDEditor from "@uiw/react-md-editor"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
    AlertTriangle,
    Calendar,
    Download,
    Flag,
    Loader2,
    MapPin,
    Trash2,
    X,
} from "lucide-react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useEventReportsStore } from "@/store/admin/eventReport"

const EventModerationPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        reportedEvents,
        pagination,
        selectedReport,
        isLoading,
        error,
        fetchReportedEvents,
        fetchEventReportDetails,
        dismissReports,
        deleteEvent,
        // clearSelectedReport,
        setPage,
        setLimit,
    } = useEventReportsStore()

    useEffect(() => {
        fetchReportedEvents()
    }, [fetchReportedEvents])

    const handleRowClick = async (eventId: string) => {
        await fetchEventReportDetails(eventId)
        setIsModalOpen(true)
    }

    const handleDismissReports = async () => {
        if (selectedReport) {
            await dismissReports(selectedReport.event_data.id)
            setIsModalOpen(false)
        }
    }

    const handleDeleteEvent = async () => {
        if (selectedReport) {
            await deleteEvent(selectedReport.event_data.id)
            setIsModalOpen(false)
        }
    }

    const generatePDF = () => {
        if (!selectedReport) return

        const doc = new jsPDF()
        const event = selectedReport.event_data
        const flags = selectedReport.flag_data

        // Title
        doc.setFontSize(18)
        doc.text("Event Report", 14, 22)

        // Event details
        doc.setFontSize(14)
        doc.text("Event Information", 14, 35)

        doc.setFontSize(10)
        const eventDetails = [
            ["Event ID", event.id],
            ["Title", event.title],
            ["Organizer", event.posted_by.full_name],
            ["Created At", format(new Date(event.created_at), "PPP p")],
            ["Venue", event.venue],
            ["Event Type", event.event_type],
            ["Start Date", format(new Date(event.start_date_time), "PPP p")],
            ["End Date", format(new Date(event.end_date_time), "PPP p")],
        ]

        autoTable(doc, {
            startY: 40,
            head: [["Field", "Value"]],
            body: eventDetails,
            theme: "striped",
            headStyles: { fillColor: [75, 85, 99] },
        })

        // Flag details
        const finalY =
            (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
                .finalY + 10

        doc.setFontSize(14)
        doc.text("Flag Information", 14, finalY)

        const flagsData = flags.map((flag) => [
            flag.person_who_flagged.name,
            flag.reason,
            format(new Date(flag.flag_date), "PPP p"),
        ])

        autoTable(doc, {
            startY: finalY + 5,
            head: [["Reporter", "Reason", "Flagged At"]],
            body: flagsData,
            theme: "striped",
            headStyles: { fillColor: [75, 85, 99] },
        })

        doc.save(`event-report-${event.id}.pdf`)
    }

    const renderPagination = () => {
        const { current_page, total_pages } = pagination

        return (
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() =>
                                current_page > 1 && setPage(current_page - 1)
                            }
                            className={
                                current_page <= 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>

                    {Array.from(
                        { length: Math.min(5, total_pages) },
                        (_, i) => {
                            let pageNumber: number

                            if (total_pages <= 5) {
                                pageNumber = i + 1
                            } else if (current_page <= 3) {
                                pageNumber = i + 1
                            } else if (current_page >= total_pages - 2) {
                                pageNumber = total_pages - 4 + i
                            } else {
                                pageNumber = current_page - 2 + i
                            }

                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink
                                        onClick={() => setPage(pageNumber)}
                                        isActive={current_page === pageNumber}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        }
                    )}

                    {total_pages > 5 && current_page < total_pages - 2 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                current_page < total_pages &&
                                setPage(current_page + 1)
                            }
                            className={
                                current_page >= total_pages
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                    Error Loading Reports
                </h3>
                <p className="text-gray-500">{error}</p>
                <Button onClick={() => fetchReportedEvents()} className="mt-4">
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold font-philosopher  text-xl overflow-hidden whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Event Moderation
                </h1>
                <div className="flex items-center gap-2">
                    <Select
                        value={pagination.per_page.toString()}
                        onValueChange={(value) => setLimit(Number(value))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10 per page</SelectItem>
                            <SelectItem value="20">20 per page</SelectItem>
                            <SelectItem value="30">30 per page</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border rounded-md shadow-sm">
                <CardContent className="p-0">
                    {isLoading && reportedEvents.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : reportedEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Flag className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                No Reported Events
                            </h3>
                            <p className="text-gray-500">
                                There are no reported events to moderate at this
                                time.
                            </p>
                        </div>
                    ) : (
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Event Title</TableHead>
                                        <TableHead>Organizer</TableHead>
                                        <TableHead>Flag Count</TableHead>
                                        <TableHead>Top Reason</TableHead>
                                        <TableHead>Post Date</TableHead>
                                        <TableHead>Last Flagged</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportedEvents.map((event) => (
                                        <Tooltip key={event.event_id}>
                                            <TooltipTrigger asChild>
                                                <TableRow
                                                    key={event.event_id}
                                                    onClick={() =>
                                                        handleRowClick(
                                                            event.event_id
                                                        )
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <TableCell className="font-medium max-w-[200px] truncate">
                                                        {event.title.length > 50
                                                            ? `${event.title.substring(0, 50)}...`
                                                            : event.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        {event.posted_by.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="destructive">
                                                            {event.flag_count}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {event.top_reason}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                event.post_date
                                                            ),
                                                            "PP"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                event.last_flagged
                                                            ),
                                                            "PP"
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Click to view details</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ))}
                                </TableBody>
                            </Table>
                        </TooltipProvider>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center py-4">
                    {renderPagination()}
                </CardFooter>
            </Card>

            {/* Details Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent
                    className="max-w-3xl max-h-[90vh] overflow-y-auto"
                    showCloseButton={false}
                >
                    {selectedReport ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Event Report Details</DialogTitle>
                                <DialogDescription>
                                    Detailed information about the reported
                                    event
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="event">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="event">
                                        Event Information
                                    </TabsTrigger>
                                    <TabsTrigger value="flags">
                                        Flag Reports (
                                        {selectedReport.flag_data.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="event"
                                    className="space-y-4 pt-4"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold">
                                                {
                                                    selectedReport.event_data
                                                        .title
                                                }
                                            </h2>
                                            <Badge variant="outline">
                                                {
                                                    selectedReport.event_data
                                                        .event_type
                                                }
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-5 w-5" />
                                            <span>
                                                {
                                                    selectedReport.event_data
                                                        .venue
                                                }
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm">
                                                    Start:{" "}
                                                    {format(
                                                        new Date(
                                                            selectedReport.event_data.start_date_time
                                                        ),
                                                        "PPP p"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm">
                                                    End:{" "}
                                                    {format(
                                                        new Date(
                                                            selectedReport.event_data.end_date_time
                                                        ),
                                                        "PPP p"
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <MDEditor.Markdown
                                                style={{
                                                    backgroundColor:
                                                        "transparent",
                                                    color: "inherit",
                                                }}
                                                source={
                                                    selectedReport.event_data
                                                        .description
                                                }
                                            />
                                        </div>

                                        {selectedReport.event_data
                                            .register_link && (
                                            <>
                                                <Separator />
                                                <Button
                                                    asChild
                                                    className="w-fit"
                                                >
                                                    <a
                                                        href={
                                                            selectedReport
                                                                .event_data
                                                                .register_link
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Registration Link
                                                    </a>
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent
                                    value="flags"
                                    className="space-y-4 pt-4"
                                >
                                    {selectedReport.flag_data.map(
                                        (flag, index) => (
                                            <Card key={index}>
                                                <CardHeader className="py-3">
                                                    <div className="flex justify-between">
                                                        <CardTitle className="text-sm font-medium">
                                                            Reported by:{" "}
                                                            {
                                                                flag
                                                                    .person_who_flagged
                                                                    .name
                                                            }
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {format(
                                                                new Date(
                                                                    flag.flag_date
                                                                ),
                                                                "PPP p"
                                                            )}
                                                        </CardDescription>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="py-2">
                                                    <div className="flex items-start gap-2">
                                                        <Flag className="w-4 h-4 text-red-500 mt-0.5" />
                                                        <p>{flag.reason}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    )}
                                </TabsContent>
                            </Tabs>

                            <DialogFooter className="flex justify-between sm:justify-between gap-2">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={generatePDF}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download PDF
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleDismissReports}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Dismiss Reports
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteEvent}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Event
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EventModerationPage
