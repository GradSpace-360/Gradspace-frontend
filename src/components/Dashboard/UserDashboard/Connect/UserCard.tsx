import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { axiosPrivate } from "@/config/axiosInstance"

import { useUserStore } from "./user-store"

interface UserCardProps {
    user: {
        id: string
        fullName: string
        userName: string
        profileImage: string
        department: string
        batch: number
        role: string
        isFollowing: boolean
    }
}

const UserCard = ({ user }: UserCardProps) => {
    const { toggleFollow, isLoading } = useUserStore()

    const handleFollow = async () => {
        try {
            await toggleFollow(user.userName, user.isFollowing)
        } catch (error) {
            console.error("Failed to toggle follow:", error)
        }
    }

    return (
        <div className="flex flex-col rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-4">
                <img
                    src={`${axiosPrivate.defaults.baseURL}/${user.profileImage}`}
                    alt={user.fullName}
                    className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-muted-foreground">
                        @{user.userName}
                    </p>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                    <Badge variant="outline">{user.role}</Badge>
                    <Badge variant="secondary">Batch {user.batch}</Badge>
                </div>
                <p className="text-sm">{user.department}</p>
            </div>

            <div className="mt-4 flex gap-2">
                <Link
                    to={`/dashboard/profile/${user.userName}`}
                    className="flex-1"
                >
                    <Button variant="outline" className="w-full">
                        View Profile
                    </Button>
                </Link>
                <Button
                    variant={user.isFollowing ? "secondary" : "default"}
                    onClick={handleFollow}
                    disabled={isLoading}
                >
                    {user.isFollowing ? "Following" : "Follow"}
                </Button>
            </div>
        </div>
    )
}

export default UserCard
