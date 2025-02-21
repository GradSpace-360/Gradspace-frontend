import { Terminal } from "lucide-react"
import { useEffect } from "react"

import { Alert, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { usePostStore } from "@/store/user/post"

import { PostCard } from "./PostCard"

interface PostsListProps {
    variant: "global" | "user"
    username?: string
}

export function PostsList({ variant, username }: PostsListProps) {
    const {
        homePosts,
        homeLoading,
        error,
        homeHasMore,
        fetchPosts,
        fetchUserPosts,
    } = usePostStore()

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                    document.documentElement.offsetHeight - 500 &&
                !homeLoading &&
                homeHasMore
            ) {
                if (variant === "global") {
                    fetchPosts()
                } else if (username) {
                    fetchUserPosts(username)
                }
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [
        homeLoading,
        homeHasMore,
        fetchPosts,
        fetchUserPosts,
        variant,
        username,
    ])

    useEffect(() => {
        if (variant === "global") {
            fetchPosts(true)
        } else if (username) {
            fetchUserPosts(username, true)
        }
    }, [fetchPosts, fetchUserPosts, variant, username])

    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>{error}</AlertTitle>
            </Alert>
        )
    }

    return (
        <div className="">
            <div className="space-y-8">
                {homePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}

                {homeLoading && (
                    <div className="space-y-8">
                        {[...Array(2)].map((_, i) => (
                            <div
                                key={i}
                                className="space-y-4 p-6 border rounded-lg"
                            >
                                <div className="flex items-center space-x-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-3 w-[150px]" />
                                    </div>
                                </div>
                                <Skeleton className="h-[150px] w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                )}

                {!homeHasMore && (
                    <p className="text-center text-muted-foreground py-8">
                        You've reached the end! 🎉
                    </p>
                )}
            </div>
        </div>
    )
}
