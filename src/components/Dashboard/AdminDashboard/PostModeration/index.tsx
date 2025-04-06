import { format } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
    AlertTriangle,
    Calendar,
    Download,
    Flag,
    Loader2,
    MessageSquare,
    ThumbsUp,
    Trash2,
    User,
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
import { usePostReportsStore } from "@/store/admin/postReport"
const PostModerationPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {
        reportedPosts,
        pagination,
        selectedReport,
        isLoading,
        error,
        fetchReportedPosts,
        fetchPostReportDetails,
        dismissReports,
        deletePost,
        // clearSelectedReport,
        setPage,
        setLimit,
    } = usePostReportsStore()

    useEffect(() => {
        fetchReportedPosts()
    }, [fetchReportedPosts])

    const handleRowClick = async (postId: string) => {
        await fetchPostReportDetails(postId)
        setIsModalOpen(true)
    }

    // const handleCloseModal = () => {
    //     setIsModalOpen(false)
    //     clearSelectedReport()
    // }

    const handleDismissReports = async () => {
        if (selectedReport) {
            await dismissReports(selectedReport.post_data.id)
            setIsModalOpen(false)
        }
    }

    const handleDeletePost = async () => {
        if (selectedReport) {
            await deletePost(selectedReport.post_data.id)
            setIsModalOpen(false)
        }
    }

    const generatePDF = () => {
        if (!selectedReport) return

        const doc = new jsPDF()
        const post = selectedReport.post_data
        const flags = selectedReport.flag_data

        // Title
        doc.setFontSize(18)
        doc.text("Post Report", 14, 22)

        // Post details
        doc.setFontSize(14)
        doc.text("Post Information", 14, 35)

        doc.setFontSize(10)
        const postDetails = [
            ["Post ID", post.id],
            ["Author", post.author.username],
            ["Created At", format(new Date(post.createdAt), "PPP p")],
            ["Likes", post.likes.toString()],
            ["Comments", post.comments.toString()],
            [
                "Content",
                post.content.substring(0, 100) +
                    (post.content.length > 100 ? "..." : ""),
            ],
        ]

        autoTable(doc, {
            startY: 40,
            head: [["Field", "Value"]],
            body: postDetails,
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
            flag.reporter,
            flag.reason,
            format(new Date(flag.flagged_at), "PPP p"),
        ])

        autoTable(doc, {
            startY: finalY + 5,
            head: [["Reporter", "Reason", "Flagged At"]],
            body: flagsData,
            theme: "striped",
            headStyles: { fillColor: [75, 85, 99] },
        })

        // Save the PDF
        doc.save(`post-report-${post.id}.pdf`)
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
                <Button onClick={() => fetchReportedPosts()} className="mt-4">
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold font-philosopher  text-xl overflow-hidden whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Post Moderation
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
                <CardContent className="p-0 ">
                    {isLoading && reportedPosts.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : reportedPosts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Flag className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">
                                No Reported Posts
                            </h3>
                            <p className="text-gray-500">
                                There are no reported posts to moderate at this
                                time.
                            </p>
                        </div>
                    ) : (
                        <TooltipProvider>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Post Preview</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Flag Count</TableHead>
                                        <TableHead>Top Reason</TableHead>
                                        <TableHead>Post Date</TableHead>
                                        <TableHead>Last Flagged</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportedPosts.map((post) => (
                                        <Tooltip key={post.post_id}>
                                            <TooltipTrigger asChild>
                                                <TableRow
                                                    key={post.post_id}
                                                    onClick={() =>
                                                        handleRowClick(
                                                            post.post_id
                                                        )
                                                    }
                                                    className="cursor-pointer "
                                                >
                                                    <TableCell className="font-medium max-w-xs truncate">
                                                        {post.post_preview !==
                                                        "" ? (
                                                            <img
                                                                src={`${axiosPrivate.defaults.baseURL}/${post.post_preview}`}
                                                                alt="post"
                                                                className="w-8 h-8  rounded object-cover"
                                                            />
                                                        ) : (
                                                            <Flag className="w-4 h-4 mr-2" />
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {post.author.username}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="destructive">
                                                            {post.flag_count}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {post.top_reason}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                post.post_date
                                                            ),
                                                            "PP"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(
                                                            new Date(
                                                                post.last_flagged
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
                                <DialogTitle>Post Report Details</DialogTitle>
                                <DialogDescription>
                                    Detailed information about the reported post
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="post">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="post">
                                        Post Information
                                    </TabsTrigger>
                                    <TabsTrigger value="flags">
                                        Flag Reports (
                                        {selectedReport.flag_data.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="post"
                                    className="space-y-4 pt-4"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <span className="font-semibold">
                                                    {
                                                        selectedReport.post_data
                                                            .author.username
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {format(
                                                        new Date(
                                                            selectedReport.post_data.createdAt
                                                        ),
                                                        "PPP p"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex items-center gap-1 text-sm">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>
                                                    {
                                                        selectedReport.post_data
                                                            .likes
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>
                                                    {
                                                        selectedReport.post_data
                                                            .comments
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="p-4 border rounded-md ">
                                        <p className="whitespace-pre-wrap">
                                            {selectedReport.post_data.content}
                                        </p>

                                        {selectedReport.post_data.image !==
                                        "" ? (
                                            <div className="mt-4">
                                                <img
                                                    src={`${axiosPrivate.defaults.baseURL}/${selectedReport.post_data.image}`}
                                                    alt="Post attachment"
                                                    className="max-h-64 rounded-md object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mt-4">
                                                <Flag className="w-4 h-4 mr-2" />
                                            </div>
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
                                                            {flag.reporter}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {format(
                                                                new Date(
                                                                    flag.flagged_at
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
                                        onClick={handleDeletePost}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Post
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

export default PostModerationPage
