import { formatDistanceToNow } from "date-fns"
import { motion } from "framer-motion"
import { Camera, Heart, MessageCircle, SendHorizontal } from "lucide-react"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { axiosPrivate } from "@/config/axiosInstance"
import { usePostStore } from "@/store/user/post"

import { PostCard } from "../Home/PostCard"

interface UserPostGridProps {
    username: string
}

export function UserPostGrid({ username }: UserPostGridProps) {
    const {
        userPosts: posts,
        userLoading: loading,
        error,
        userHasMore: hasMore,
        fetchUserPosts,
        selectedPostId,
        setSelectedPostId,
    } = usePostStore()
    const [commentInput, setCommentInput] = useState("")
    const { createComment } = usePostStore()

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight - 500 &&
                !loading &&
                hasMore
            ) {
                fetchUserPosts(username)
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [loading, hasMore, username, fetchUserPosts])

    useEffect(() => {
        fetchUserPosts(username, true)
    }, [username, fetchUserPosts])

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (commentInput.trim() && selectedPostId) {
            createComment(selectedPostId, commentInput.trim())
            setCommentInput("")
        }
    }
    if (error)
        return (
            <div className="text-center py-8 ">
                <div className="rounded-full  border-2 dark:border-zinc-700 border-zinc-500 w-20 h-20 flex items-center justify-center mb-4 mx-auto">
                    <Camera className="text-zinc-700 dark:text-zinc-500" />
                </div>
                <span className="font-bold text-zinc-700 dark:text-zinc-500">
                    {" "}
                    No Posts Yet{" "}
                </span>
            </div>
        )

    const selectedPost = posts.find((post) => post.id === selectedPostId)

    return (
        <div className="w-full">
            {/* Grid Layout */}
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-2">
                {posts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="aspect-square cursor-pointer relative group"
                        onClick={() => setSelectedPostId(post.id)}
                    >
                        <div className="w-full h-full bg-muted relative overflow-hidden">
                            {post.image ? (
                                <img
                                    src={`${axiosPrivate.defaults.baseURL}/${post.image}`}
                                    alt="Post content"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-900">
                                    <p className="text-muted-foreground">
                                        No Image
                                    </p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <div className="flex items-center text-white">
                                    <Heart
                                        className="w-5 h-5 mr-1"
                                        fill="white"
                                    />
                                    <span>{post.likes}</span>
                                </div>
                                <div className="flex items-center text-white">
                                    <MessageCircle
                                        className="w-5 h-5 mr-1"
                                        fill="white"
                                    />
                                    <span>{post.comments}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-muted animate-pulse"
                        />
                    ))}
                </div>
            )}

            {!hasMore && (
                <p className="text-center text-muted-foreground py-8">
                    No more posts to show
                </p>
            )}

            <Dialog
                open={!!selectedPost}
                onOpenChange={() => setSelectedPostId(null)}
            >
                <DialogContent className="max-w-4xl p-0 overflow-hidden max-h-[90vh]">
                    {selectedPost && (
                        <div className="grid grid-cols-1 lg:grid-cols-2  lg:h-full ">
                            {/* Image Section - Desktop */}
                            <div className="hidden lg:flex bg-muted min-h-[500px] relative">
                                {selectedPost.image ? (
                                    <img
                                        src={`${axiosPrivate.defaults.baseURL}/${selectedPost.image}`}
                                        alt="Post content"
                                        className="w-full h-full object-contain bg-zinc-100 dark:bg-black/75"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                                        <p className="text-muted-foreground">
                                            No Image
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Comments Section */}
                            <div className="hidden lg:flex flex-col h-full">
                                <div className="p-6 flex flex-col h-[calc(90vh-2rem)]">
                                    {/* Post Header */}
                                    <div className="flex items-center gap-4 pb-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={`${axiosPrivate.defaults.baseURL}/${selectedPost.author.image}`}
                                            />
                                            <AvatarFallback>
                                                {
                                                    selectedPost.author
                                                        .username[0]
                                                }
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">
                                                {selectedPost.author.username}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(
                                                    new Date(
                                                        selectedPost.createdAt
                                                    ),
                                                    { addSuffix: true }
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <p className="text-base leading-relaxed break-words mb-4">
                                        {selectedPost.content}
                                    </p>

                                    {/* Scrollable Comments List */}
                                    <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                                        {(selectedPost.commentList || []).map(
                                            (comment) => (
                                                <div
                                                    key={comment.id}
                                                    className="flex items-start gap-3"
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={`${axiosPrivate.defaults.baseURL}/${comment.author.image}`}
                                                        />
                                                        <AvatarFallback>
                                                            {
                                                                comment.author
                                                                    .username[0]
                                                            }
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="bg-muted/50 rounded-lg p-3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        comment
                                                                            .author
                                                                            .username
                                                                    }
                                                                </p>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            comment.createdAt
                                                                        ),
                                                                        {
                                                                            addSuffix:
                                                                                true,
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm">
                                                                {
                                                                    comment.content
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                        {!selectedPost.commentList?.length && (
                                            <p className="text-center text-muted-foreground py-4">
                                                No comments yet
                                            </p>
                                        )}
                                    </div>

                                    {/* Sticky Comment Input */}
                                    <form
                                        onSubmit={handleCommentSubmit}
                                        className="sticky bottom-0 bg-background mt-4 border-t"
                                    >
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                value={commentInput}
                                                onChange={(e) =>
                                                    setCommentInput(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Add a comment..."
                                                className="flex-1 border-none rounded  text-base focus:outline-none p-4"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                variant="ghost"
                                                className="h-9"
                                            >
                                                <SendHorizontal />
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Mobile View - Full PostCard */}
                            <div className="lg:hidden overflow-auto max-h-[90vh]">
                                <PostCard post={selectedPost} />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
