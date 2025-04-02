import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { axiosPrivate } from "@/config/axiosInstance"
import { useProfileStore } from "@/store/user/profile"

interface ConnectionDialogsProps {
    username: string
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    activeTab: "followers" | "following"
    setActiveTab: (tab: "followers" | "following") => void
}

export const ConnectionDialogs = ({
    username,
    isOpen,
    onOpenChange,
    activeTab,
    setActiveTab,
}: ConnectionDialogsProps) => {
    const navigate = useNavigate()
    const {
        followers,
        following,
        loadingConnections,
        fetchFollowers,
        fetchFollowing,
        toggleFollowInList,
    } = useProfileStore()

    // Fetch data when dialog opens
    const handleOpenChange = (open: boolean) => {
        if (open) {
            if (activeTab === "followers") {
                fetchFollowers(username)
            } else {
                fetchFollowing(username)
            }
        }
        onOpenChange(open)
    }

    // Fetch connections when the component mounts
    useEffect(() => {
        // Fetch followers or following based on the active tab
        const fetchConnections = () => {
            if (activeTab === "followers") {
                fetchFollowers(username)
            } else {
                fetchFollowing(username)
            }
        }
        if (isOpen) {
            fetchConnections()
        }
    }, [isOpen, activeTab, username])
    // Fetch connections when the active tab changes

    // Handle tab change
    const handleTabChange = (value: string) => {
        const newTab = value as "followers" | "following"
        setActiveTab(newTab)

        if (newTab === "followers") {
            fetchFollowers(username)
        } else {
            fetchFollowing(username)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                className="w-full h-full lg:h-auto sm:max-h-[80vh] xm:max-w-xl xm:min-h-[400px] flex flex-col"
                showCloseButton={true}
            >
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Connections
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>

                    <TabsContent value="followers" className="mt-0">
                        {loadingConnections ? (
                            <ConnectionsLoading />
                        ) : followers.length === 0 ? (
                            <div className="py-8 text-center text-zinc-500">
                                No followers yet
                            </div>
                        ) : (
                            <div className="max-h-[60vh] overflow-y-auto">
                                {followers.map((follower) => (
                                    <ConnectionItem
                                        key={follower.userName}
                                        connection={follower}
                                        onProfileClick={() => {
                                            navigate(
                                                `/dashboard/profile/${follower.userName}`
                                            )
                                            onOpenChange(false)
                                        }}
                                        onToggleFollow={() =>
                                            toggleFollowInList(
                                                follower.userName,
                                                "followers"
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="following" className="mt-0">
                        {loadingConnections ? (
                            <ConnectionsLoading />
                        ) : following.length === 0 ? (
                            <div className="py-8 text-center text-zinc-500">
                                Not following anyone yet
                            </div>
                        ) : (
                            <div className="max-h-[60vh] overflow-y-auto">
                                {following.map((followed) => (
                                    <ConnectionItem
                                        key={followed.userName}
                                        connection={followed}
                                        onProfileClick={() => {
                                            navigate(
                                                `/dashboard/profile/${followed.userName}`
                                            )
                                            onOpenChange(false)
                                        }}
                                        onToggleFollow={() =>
                                            toggleFollowInList(
                                                followed.userName,
                                                "following"
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

// Connection Item Component
interface ConnectionItemProps {
    connection: {
        fullName: string
        isFollowing: boolean
        profileImageUrl: string
        userName: string
    }
    onProfileClick: () => void
    onToggleFollow: () => void
}

const ConnectionItem = ({
    connection,
    onProfileClick,
    onToggleFollow,
}: ConnectionItemProps) => {
    return (
        <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
            <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={onProfileClick}
            >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                        src={`${axiosPrivate.defaults.baseURL}/${connection.profileImageUrl}`}
                        alt={`${connection.fullName}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                                "/user_avatar.png"
                        }}
                    />
                </div>
                <div>
                    <p className="font-medium text-sm">{connection.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                        @{connection.userName}
                    </p>
                </div>
            </div>

            <Button
                variant={connection.isFollowing ? "outline" : "default"}
                size="sm"
                onClick={(e) => {
                    e.stopPropagation()
                    onToggleFollow()
                }}
            >
                {connection.isFollowing ? "Unfollow" : "Follow"}
            </Button>
        </div>
    )
}

// Loading state component
const ConnectionsLoading = () => {
    return (
        <div className="space-y-4 py-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16 mt-1" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-16" />
                </div>
            ))}
        </div>
    )
}
