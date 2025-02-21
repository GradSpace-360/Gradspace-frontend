import { formatDistanceToNow } from "date-fns"
import {
    BellIcon,
    HeartIcon,
    MessageCircleIcon,
    UserPlusIcon,
} from "lucide-react"
import { useEffect } from "react"
import { NavLink } from "react-router-dom"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { axiosPrivate } from "@/config/axiosInstance"
import useNotificationStore from "@/store/user/notification"

const NotificationSkeleton = () => (
    <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[180px]" />
                </div>
            </div>
        ))}
    </div>
)

const getNotificationIcon = (type: string) => {
    switch (type) {
        case "LIKE":
            return <HeartIcon className="size-4 text-red-500" />
        case "COMMENT":
            return <MessageCircleIcon className="size-4 text-blue-500" />
        case "FOLLOW":
            return <UserPlusIcon className="size-4 text-green-500" />
        default:
            return <BellIcon className="size-4 text-primary" />
    }
}

function NotificationsPage() {
    const { notifications, loading, error, fetchNotifications } =
        useNotificationStore()

    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    if (loading) return <NotificationSkeleton />
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>

    return (
        <div className="space-y-4 lg:w-[80%] mx-auto">
            <Card className="border-none shadow-none">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <CardTitle>Notifications</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            {notifications.filter((n) => !n.read).length} unread
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-start gap-4 p-4 border-b hover:bg-muted/25 transition-colors ${
                                        !notification.read ? "bg-muted/50" : ""
                                    }`}
                                >
                                    <NavLink
                                        to={`/dashboard/profile/${notification.creator.username}`}
                                        className="block"
                                    >
                                        <Avatar className="mt-1">
                                            <AvatarImage
                                                src={
                                                    notification.creator.image
                                                        ? `${axiosPrivate.defaults.baseURL}/${notification.creator.image}`
                                                        : "/avatar.png"
                                                }
                                            />
                                        </Avatar>
                                    </NavLink>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            {getNotificationIcon(
                                                notification.type
                                            )}
                                            <span>
                                                <NavLink
                                                    to={`/dashboard/profile/${notification.creator.username}`}
                                                    className="block"
                                                >
                                                    <span className="font-medium">
                                                        {
                                                            notification.creator
                                                                .username
                                                        }
                                                    </span>{" "}
                                                </NavLink>
                                                {notification.type === "FOLLOW"
                                                    ? "started following you"
                                                    : notification.type ===
                                                        "LIKE"
                                                      ? "liked your post"
                                                      : "commented on your post"}
                                            </span>
                                        </div>

                                        {notification.post &&
                                            (notification.type === "LIKE" ||
                                                notification.type ===
                                                    "COMMENT") && (
                                                <div className="pl-6 space-y-2">
                                                    <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/30 mt-2">
                                                        <p>
                                                            {
                                                                notification
                                                                    .post
                                                                    .content
                                                            }
                                                        </p>
                                                        {notification.post
                                                            .image && (
                                                            <img
                                                                src={`${axiosPrivate.defaults.baseURL}/${notification.post.image}`}
                                                                alt="Post content"
                                                                className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                                            />
                                                        )}
                                                    </div>

                                                    {notification.type ===
                                                        "COMMENT" &&
                                                        notification.comment && (
                                                            <div className="text-sm p-2 bg-accent/50 rounded-md">
                                                                {
                                                                    notification
                                                                        .comment
                                                                        .content
                                                                }
                                                            </div>
                                                        )}
                                                </div>
                                            )}

                                        <p className="text-sm text-muted-foreground pl-6">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.createdAt
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

export default NotificationsPage
