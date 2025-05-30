import { formatDistanceToNow } from "date-fns"
import { Flag, Heart, MessageCircle, MoreVertical, Trash } from "lucide-react"
import type React from "react"
import { useState } from "react"
import toast from "react-hot-toast"
import { NavLink } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { axiosPrivate } from "@/config/axiosInstance"
import { useAuthStore } from "@/store/auth"
import { usePostStore } from "@/store/user/post"

type Comment = {
    id: string
    content: string
    createdAt: Date
    author: {
        id: string
        username: string
        image?: string
    }
}

type Post = {
    id: string
    content: string
    image?: string
    createdAt: Date
    author: {
        id: string
        username: string
        image?: string
    }
    comments: number
    likes: number
    isLiked: boolean
    commentList: Comment[] | []
}

type ReportReason = "inappropriateContent" | "Spam" | "Harassment"

export function PostCard({ post }: { post: Post }) {
    const {
        toggleLike,
        createComment,
        deletePost,
        deleteComment,
        reportPost,
        reportError,
    } = usePostStore()
    const [showCommentsModal, setShowCommentsModal] = useState(false)
    const [showReportModal, setShowReportModal] = useState(false)
    const [commentInput, setCommentInput] = useState("")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const { user } = useAuthStore()
    const isAuthor = user?.id === post.author.id

    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (commentInput.trim()) {
            createComment(post.id, commentInput)
            setCommentInput("")
        }
    }

    const handleDeletePost = () => {
        deletePost(post.id)
        setIsDropdownOpen(false)
    }

    const handleDeleteComment = (commentId: string) => {
        deleteComment(post.id, commentId)
    }

    const handleReportPost = () => {
        // Explicitly close the dropdown before opening the modal
        setIsDropdownOpen(false)
        // Use setTimeout to ensure dropdown is fully closed before opening modal
        setTimeout(() => {
            setShowReportModal(true)
        }, 100)
    }

    const submitReport = async (reason: ReportReason) => {
        try {
            await reportPost(post.id, reason)
            toast.success("Post reported successfully.")
        } catch {
            // Error handling is managed by the store
            toast.error(reportError || "Failed to report the post.")
        } finally {
            setShowReportModal(false)
        }
    }

    // Handle modal closing with cleanup
    const handleReportModalClose = (open: boolean) => {
        if (!open) {
            // Add a small delay to ensure proper cleanup
            setTimeout(() => {
                setShowReportModal(false)
            }, 50)
        } else {
            setShowReportModal(true)
        }
    }

    const handleCommentsModalClose = (open: boolean) => {
        if (!open) {
            // Add a small delay to ensure proper cleanup
            setTimeout(() => {
                setShowCommentsModal(false)
            }, 50)
        } else {
            setShowCommentsModal(true)
        }
    }

    return (
        <>
            {/* Main Post Card */}
            <Card className="mb-6 rounded-md shadow-md p-0 border dark:border-muted">
                <CardHeader className="flex flex-row items-center justify-between pl-3 pt-3 pb-2">
                    <div className="flex items-center gap-4">
                        <NavLink
                            to={`/dashboard/profile/${post.author.username}`}
                            className="block"
                        >
                            <Avatar>
                                <AvatarImage
                                    src={`${axiosPrivate.defaults.baseURL}/${post.author.image}`}
                                />
                                <AvatarFallback>
                                    {post.author.username[0]}
                                </AvatarFallback>
                            </Avatar>
                        </NavLink>
                        <div>
                            <NavLink
                                to={`/dashboard/profile/${post.author.username}`}
                                className="block"
                            >
                                <h3 className="font-semibold">
                                    {post.author.username}
                                </h3>
                            </NavLink>
                            <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(new Date(post.createdAt), {
                                    addSuffix: true,
                                })}
                            </p>
                        </div>
                    </div>

                    {/* 3-dot menu with delete/report options */}
                    <DropdownMenu
                        open={isDropdownOpen}
                        onOpenChange={setIsDropdownOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isAuthor ? (
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={handleDeletePost}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete post
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={handleReportPost}>
                                    <Flag className="mr-2 h-4 w-4" />
                                    Report post
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className="space-y-4 pb-3 p-1">
                    <p className="text-base pl-4 leading-relaxed break-words ">
                        {post.content}
                    </p>
                    {post.image && (
                        <div className="relative w-full pb-[100%] overflow-hidden rounded-sm">
                            <img
                                src={`${axiosPrivate.defaults.baseURL}/${post.image}`}
                                alt="Post"
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                        </div>
                    )}
                </CardContent>

                <CardFooter className="gap-4 p-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 hover:bg-accent/50"
                        onClick={() => toggleLike(post.id)}
                    >
                        <Heart
                            className={`w-5 h-5 ${post.isLiked ? "fill-red-500 text-red-500 animate-pop" : ""}`}
                        />
                        <span className="font-medium">{post.likes}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 hover:bg-accent/50"
                        onClick={() => setShowCommentsModal(true)}
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">{post.comments}</span>
                    </Button>
                </CardFooter>
            </Card>

            {/* Comments Modal */}
            <Dialog
                open={showCommentsModal}
                onOpenChange={handleCommentsModalClose}
            >
                <DialogContent className="w-full h-full lg:h-auto sm:max-h-[80vh] xm:max-w-2xl xm:min-h-[400px] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            Comments
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col flex-1 overflow-hidden">
                        {/* Scrollable Comments List */}
                        <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                            {(post.commentList || []).map((comment) => (
                                <div
                                    key={comment.id}
                                    className="flex items-start gap-3"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={`${axiosPrivate.defaults.baseURL}/${comment.author.image}`}
                                        />
                                        <AvatarFallback>
                                            {comment.author.username[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="bg-muted/50 rounded-lg p-3">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium">
                                                        {
                                                            comment.author
                                                                .username
                                                        }
                                                    </p>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                comment.createdAt
                                                            ),
                                                            {
                                                                addSuffix: true,
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                                {user?.id ===
                                                    comment.author.id && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment.id
                                                            )
                                                        }
                                                    >
                                                        <Trash className="h-3 w-3 text-destructive" />
                                                        <span className="sr-only">
                                                            Delete comment
                                                        </span>
                                                    </Button>
                                                )}
                                            </div>
                                            <p className="text-sm">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!post.commentList?.length && (
                                <p className="text-center text-muted-foreground py-4">
                                    No comments yet
                                </p>
                            )}
                        </div>

                        {/* Sticky Comment Input */}
                        <form
                            onSubmit={handleCommentSubmit}
                            className="sticky bottom-0 bg-background pt-4 border-t"
                        >
                            <div className="flex gap-2 mt-4">
                                <Input
                                    value={commentInput}
                                    onChange={(e) =>
                                        setCommentInput(e.target.value)
                                    }
                                    placeholder="Add a comment..."
                                    className="flex-1"
                                />
                                <Button type="submit" size="sm">
                                    Post
                                </Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Report Post Modal - Separate from dropdown state management */}
            <Dialog
                open={showReportModal}
                onOpenChange={handleReportModalClose}
            >
                <DialogContent className="sm:max-w-md" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>Report Post</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                            Please select a reason for reporting this post:
                        </p>

                        <div className="grid gap-2">
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                                onClick={() =>
                                    submitReport("inappropriateContent")
                                }
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                Inappropriate Content
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                                onClick={() => submitReport("Spam")}
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                Spam
                            </Button>
                            <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                                onClick={() => submitReport("Harassment")}
                            >
                                <Flag className="mr-2 h-4 w-4" />
                                Harassment
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setShowReportModal(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
