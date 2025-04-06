"use client"

import MDEditor from "@uiw/react-md-editor"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
    AlertTriangle,
    Briefcase,
    Calendar,
    Download,
    Flag,
    Link2,
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
import { axiosPrivate } from "@/config/axiosInstance"
import { useJobReportsStore } from "@/store/admin/jobReport"

const JobModerationPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        reportedJobs,
        pagination,
        selectedReport,
        isLoading,
        error,
        fetchReportedJobs,
        fetchJobReportDetails,
        dismissReports,
        deleteJob,
        // clearSelectedReport,
        setPage,
        setLimit,
    } = useJobReportsStore()

    useEffect(() => {
        fetchReportedJobs()
    }, [fetchReportedJobs])

    const handleRowClick = async (jobId: string) => {
        await fetchJobReportDetails(jobId)
        setIsModalOpen(true)
    }

    const handleDismissReports = async () => {
        if (selectedReport) {
            await dismissReports(selectedReport.job_data.id)
            setIsModalOpen(false)
        }
    }

    const handleDeleteJob = async () => {
        if (selectedReport) {
            await deleteJob(selectedReport.job_data.id)
            setIsModalOpen(false)
        }
    }

    const generatePDF = () => {
        if (!selectedReport) return

        const doc = new jsPDF()
        const job = selectedReport.job_data
        const flags = selectedReport.flag_data

        // Title
        doc.setFontSize(18)
        doc.text("Job Report", 14, 22)

        // Job details
        doc.setFontSize(14)
        doc.text("Job Information", 14, 35)

        doc.setFontSize(10)
        const jobDetails = [
            ["Job ID", job.id],
            ["Title", job.title],
            ["Company", job.company.name],
            ["Posted By", job.posted_by.full_name],
            ["Created At", format(new Date(job.created_at), "PPP p")],
            ["Location", job.location],
            ["Job Type", job.job_type],
            ["Status", job.is_open ? "Open" : "Closed"],
        ]

        autoTable(doc, {
            startY: 40,
            head: [["Field", "Value"]],
            body: jobDetails,
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
            flag.reporter.name,
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

        doc.save(`job-report-${job.id}.pdf`)
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
                <Button onClick={() => fetchReportedJobs()} className="mt-4">
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="container   space-y-6 ">
            <div className="flex justify-end items-center">
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
                    {isLoading && reportedJobs.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : reportedJobs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Flag className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                No Reported Jobs
                            </h3>
                            <p className="text-gray-500">
                                There are no reported jobs to moderate at this
                                time.
                            </p>
                        </div>
                    ) : (
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Job Title</TableHead>
                                        <TableHead>Posted By</TableHead>
                                        <TableHead>Job Type</TableHead>
                                        <TableHead>Flag Count</TableHead>
                                        <TableHead>Top Reason</TableHead>
                                        <TableHead>Post Date</TableHead>
                                        <TableHead>Last Flagged</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportedJobs.map((job) => (
                                        <Tooltip key={job.job_id}>
                                            <TooltipTrigger asChild>
                                                <TableRow
                                                    key={job.job_id}
                                                    onClick={() =>
                                                        handleRowClick(
                                                            job.job_id
                                                        )
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    <TableCell className="font-medium max-w-[200px] truncate">
                                                        {job.title.length > 50
                                                            ? `${job.title.substring(0, 50)}...`
                                                            : job.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        {job.posted_by.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {job.job_type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="destructive">
                                                            {job.flag_count}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {job.top_reason}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                job.post_date
                                                            ),
                                                            "PP"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                job.last_flagged
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
                                <DialogTitle className="font-semibold font-philosopher  text-xl overflow-hidden whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                    Job Report Details
                                </DialogTitle>
                                <DialogDescription>
                                    Detailed information about the reported job
                                    posting
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="job">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="job">
                                        Job Information
                                    </TabsTrigger>
                                    <TabsTrigger value="flags">
                                        Flag Reports (
                                        {selectedReport.flag_data.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="job"
                                    className="space-y-4 pt-4"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-2xl font-bold">
                                                {selectedReport.job_data.title}
                                            </h2>
                                            <Badge
                                                variant={
                                                    selectedReport.job_data
                                                        .is_open
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {selectedReport.job_data.is_open
                                                    ? "Open"
                                                    : "Closed"}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {selectedReport.job_data.company
                                                .logo_url ? (
                                                <img
                                                    src={`${axiosPrivate.defaults.baseURL}/${
                                                        selectedReport.job_data
                                                            .company.logo_url
                                                    }`}
                                                    alt={
                                                        selectedReport.job_data
                                                            .company.name
                                                    }
                                                    className="h-16 w-16 object-contain"
                                                />
                                            ) : (
                                                <Briefcase className="h-10 w-10" />
                                            )}
                                            <div>
                                                <h3 className="font-medium">
                                                    {
                                                        selectedReport.job_data
                                                            .company.name
                                                    }
                                                </h3>
                                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                    <Badge variant="outline">
                                                        {
                                                            selectedReport
                                                                .job_data
                                                                .job_type
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-5 w-5" />
                                            <span>
                                                {
                                                    selectedReport.job_data
                                                        .location
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">
                                                Posted on:{" "}
                                                {format(
                                                    new Date(
                                                        selectedReport.job_data.created_at
                                                    ),
                                                    "PPP"
                                                )}
                                            </span>
                                        </div>

                                        <Separator />

                                        <div>
                                            <h3 className="font-semibold mb-2">
                                                Description
                                            </h3>
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <MDEditor.Markdown
                                                    style={{
                                                        backgroundColor:
                                                            "transparent",
                                                        color: "inherit",
                                                    }}
                                                    source={
                                                        selectedReport.job_data
                                                            .description
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-2">
                                                Requirements
                                            </h3>
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <MDEditor.Markdown
                                                    style={{
                                                        backgroundColor:
                                                            "transparent",
                                                        color: "inherit",
                                                    }}
                                                    source={
                                                        selectedReport.job_data
                                                            .requirements
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {selectedReport.job_data.apply_link && (
                                            <>
                                                <Separator />
                                                <div className="flex items-center gap-2">
                                                    <Link2 className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        Apply Link:
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a
                                                            href={
                                                                selectedReport
                                                                    .job_data
                                                                    .apply_link
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Open Application
                                                            Link
                                                        </a>
                                                    </Button>
                                                </div>
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
                                                            {flag.reporter.name}
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
                                        onClick={handleDeleteJob}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Job
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

export default JobModerationPage
