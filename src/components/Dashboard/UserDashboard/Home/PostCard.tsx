import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { axiosPrivate } from "@/config/axiosInstance"
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

export function PostCard({ post }: { post: Post }) {
    const { toggleLike, createComment } = usePostStore()
    const [showCommentsModal, setShowCommentsModal] = useState(false)
    const [commentInput, setCommentInput] = useState("")

    const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (commentInput.trim()) {
            createComment(post.id, commentInput)
            setCommentInput("")
        }
    }

    return (
        <>
            {/* Main Post Card */}
            <Card className="mb-6 rounded-md shadow-md p-0 border dark:border-muted ">
                <CardHeader className="flex flex-row items-center pl-3 pt-3 gap-4 pb-2">
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
                </CardHeader>

                <CardContent className="space-y-4 pb-3  p-1">
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
                onOpenChange={setShowCommentsModal}
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
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-sm font-medium">
                                                    {comment.author.username}
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
        </>
    )
}
