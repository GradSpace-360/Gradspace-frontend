import { motion } from "framer-motion"
import {
    AlertTriangle,
    BriefcaseBusinessIcon,
    Github,
    GraduationCapIcon,
    Info,
    Link2,
    Star,
    UserPlus,
    Users,
} from "lucide-react"
import { useEffect, useState } from "react"
import { FileText, Instagram, Linkedin } from "react-feather"
import { useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { axiosPrivate } from "@/config/axiosInstance"
import { cn } from "@/lib/utils"
import formatDate from "@/lib/utils"
import { useAuthStore } from "@/store/auth"
import { useProfileStore } from "@/store/user/profile"

import { ConnectionDialogs } from "./ConnectionDialogs"
import { TimelineItem } from "./TimeLineItem"
import { UserPostGrid } from "./UserPostGrid"

interface ProfilePreviewProps {
    userName: string
}

const ProfilePreview = ({ userName }: ProfilePreviewProps) => {
    const [activeTab, setActiveTab] = useState<
        "POSTS" | "EDUCATION" | "EXPERIENCE"
    >("POSTS")
    const { user: authUser } = useAuthStore()
    const { profileData, loading, error, fetchProfile, toggleFollow } =
        useProfileStore()
    const navigate = useNavigate()

    const [connectionsDialog, setConnectionsDialog] = useState<{
        isOpen: boolean
        activeTab: "followers" | "following"
    }>({
        isOpen: false,
        activeTab: "followers",
    })
    const openConnectionsDialog = (tab: "followers" | "following") => {
        setConnectionsDialog({
            isOpen: true,
            activeTab: tab,
        })
    }
    useEffect(() => {
        fetchProfile(userName)
    }, [userName, fetchProfile])
    console.log()

    if (loading) return <div></div>
    if (error)
        return (
            <div className=" p-8">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className=" p-6  mb-4"
                >
                    <div className="flex flex-col items-center p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-8 w-8 text-red-800" />
                            <h2 className="text-2xl font-semibold font-philosopher text-red-800  mb-2">
                                User Not Found
                            </h2>
                        </div>
                        <p className="text-red-800 flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            We couldn't locate the user you're looking for.
                            Please check the username and try again.
                        </p>
                    </div>
                </motion.div>
            </div>
        )
    if (!profileData) return null

    const { user, profile, educations, experiences, socialLinks } = profileData
    console.log("exp", experiences)
    const sortedExperiences = [...experiences].sort(
        (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )

    console.log(profile)
    console.log("user:", user)
    const isCurrentUser = authUser?.username === userName
    return (
        <div className="min-h-screen ">
            <div className="max-w-3xl mx-auto p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile Header */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col xs:flex-row items-start gap-4 xs:gap-6 sm:gap-8">
                            {/* Profile Picture */}
                            <div
                                className="relative w-16 h-16 xs:w-20 xs:h-20 md:w-32 md:h-32 shrink-0
              rounded-full p-[1px] bg-gradient-to-tr from-black dark:from-white
              via-black/30 dark:to-black to-white   "
                            >
                                {profile.profileImage ? (
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img
                                            src={`${axiosPrivate.defaults.baseURL}/${profile.profileImage}`}
                                            alt="Profile picture"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img
                                            src="/user_avatar.png"
                                            alt="Default avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 w-full min-w-0">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-lg sm:text-xl font-semibold truncate">
                                            {user.fullName}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            @{userName}
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="text-sm"
                                        >
                                            {user.role}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                        {isCurrentUser ? (
                                            <Button
                                                className="w-full sm:w-auto"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(
                                                        "/dashboard/settings"
                                                    )
                                                }
                                            >
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    className="flex-1 sm:flex-none"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleFollow(userName)
                                                    }
                                                >
                                                    {user.isFollowing
                                                        ? "Unfollow"
                                                        : "Follow"}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="flex-1 sm:flex-none"
                                                    size="sm"
                                                    onClick={() => {
                                                        navigate(
                                                            `/dashboard/direct/t/${user.id}`
                                                        )
                                                    }}
                                                >
                                                    Message
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Stats - Updated to be clickable */}
                                <div className="flex flex-wrap gap-4 my-3 sm:my-4">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">
                                            {user.postCount}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            posts
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() =>
                                            openConnectionsDialog("following")
                                        }
                                    >
                                        <span className="font-semibold">
                                            {user.followingCount}
                                        </span>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            following{" "}
                                            <UserPlus className="h-3 w-3" />
                                        </span>
                                    </div>
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
                                        onClick={() =>
                                            openConnectionsDialog("followers")
                                        }
                                    >
                                        <span className="font-semibold">
                                            {user.followerCount}
                                        </span>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            followers{" "}
                                            <Users className="h-3 w-3" />
                                        </span>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <h1 className="font-medium text-base line-clamp-2">
                                        {profile.headline}
                                    </h1>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
                                        {profile.about}
                                    </p>

                                    <div className="space-y-4">
                                        {/* Skills Section */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.map(
                                                    (skill, index) => (
                                                        <div key={index}>
                                                            <Badge
                                                                variant="outline"
                                                                className="px-3 py-1 text-sm font-normal rounded-lg bg-secondary/50 hover:bg-secondary"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        {/* Interests Section */}
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                Interests
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.interests.map(
                                                    (interest, index) => (
                                                        <div key={index}>
                                                            <Badge
                                                                variant="outline"
                                                                className="px-3 py-1 text-sm font-normal rounded-lg bg-accent/50 hover:bg-accent gap-1"
                                                            >
                                                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />
                                                                {interest}
                                                            </Badge>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Social Links Highlights */}
                        <ScrollArea className=" whitespace-nowrap  ">
                            <div className="flex gap-4 pb-4  ">
                                {[
                                    {
                                        title: "LinkedIn",
                                        url: socialLinks.linkedin,
                                        icon: <Linkedin className="h-6 w-6" />,
                                        color: "text-[#0A66C2]",
                                    },
                                    {
                                        title: "GitHub",
                                        url: socialLinks.github,
                                        icon: <Github className="h-6 w-6" />,
                                        color: "text-blue-800",
                                    },
                                    {
                                        title: "Instagram",
                                        url: socialLinks.instagram,
                                        icon: <Instagram className="h-6 w-6" />,
                                        color: "text-pink-500",
                                    },
                                    {
                                        title: "Resume",
                                        url: socialLinks.resume,
                                        icon: <FileText className="h-6 w-6" />,
                                        color: "text-red-500",
                                    },
                                    {
                                        title: "Website",
                                        url: socialLinks.website,
                                        icon: <Link2 className="h-6 w-6" />,
                                        color: "text-blue-400",
                                    },
                                ].map((link, index) => {
                                    const hasLink = Boolean(link.url)
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center gap-1"
                                            onClick={() =>
                                                hasLink &&
                                                window.open(link.url, "_blank")
                                            }
                                        >
                                            <div
                                                className={cn(
                                                    "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all",
                                                    hasLink
                                                        ? "border-zinc-200 dark:border-zinc-800 hover:border-white cursor-pointer"
                                                        : "border-zinc-800 cursor-not-allowed opacity-50"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "w-14 h-14 rounded-full flex items-center justify-center",
                                                        hasLink
                                                            ? "bg-zinc-100 dark:bg-primary-foreground hover:bg-primary dark:hover:bg-zinc-100"
                                                            : "bg-zinc-900"
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            link.color,
                                                            !hasLink &&
                                                                "opacity-50"
                                                        )}
                                                    >
                                                        {link.icon}
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={cn(
                                                    "text-xs",
                                                    hasLink
                                                        ? "text-primary"
                                                        : "text-zinc-500"
                                                )}
                                            >
                                                {link.title}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                            <ScrollBar
                                orientation="horizontal"
                                className="bg-zinc-800"
                            />
                        </ScrollArea>
                        {/* Navigation Tabs */}
                        <div className="border-t border-bg-primary">
                            <div className="flex justify-around -mb-px">
                                {["POSTS", "EDUCATION", "EXPERIENCE"].map(
                                    (tab) => (
                                        <button
                                            key={tab}
                                            className={`px-4 py-3 text-sm font-semibold
                                ${activeTab === tab ? "border-t-2 border-primary" : "text-primary"}`}
                                            onClick={() =>
                                                setActiveTab(
                                                    tab as
                                                        | "POSTS"
                                                        | "EDUCATION"
                                                        | "EXPERIENCE"
                                                )
                                            }
                                        >
                                            {tab}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-4">
                            {activeTab === "POSTS" && (
                                <UserPostGrid username={userName} />
                            )}

                            {activeTab === "EDUCATION" &&
                                (educations.length > 0 ? (
                                    <div className="pl-4">
                                        {educations.map((edu, index) => (
                                            <TimelineItem
                                                key={index}
                                                title={edu.course}
                                                subtitle={edu.institutionName}
                                                location={edu.location}
                                                start={formatDate(
                                                    edu.startDate
                                                )}
                                                end={formatDate(edu.endDate)}
                                                details={`Grade: ${edu.grade}`}
                                                type="EDUCATION"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="rounded-full border-2 dark:border-zinc-700 border-zinc-500 w-20 h-20 flex items-center justify-center mb-4 mx-auto">
                                            <GraduationCapIcon className="text-zinc-700 dark:text-zinc-500" />
                                        </div>
                                        <span className="font-bold text-zinc-700 dark:text-zinc-500">
                                            No education data added
                                        </span>
                                    </div>
                                ))}
                            {activeTab === "EXPERIENCE" &&
                                (sortedExperiences.length > 0 ? (
                                    <div className="pl-4">
                                        {sortedExperiences.map((exp, index) => (
                                            <TimelineItem
                                                key={index}
                                                title={exp.position}
                                                subtitle={exp.companyName}
                                                location={`${exp.location} · ${exp.jobType}`}
                                                start={formatDate(
                                                    exp.startDate
                                                )}
                                                end={
                                                    exp.endDate
                                                        ? formatDate(
                                                              exp.endDate
                                                          )
                                                        : "Present"
                                                }
                                                details={exp.locationType}
                                                type="EXPERIENCE"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="rounded-full border-2 dark:border-zinc-700 border-zinc-500 w-20 h-20 flex items-center justify-center mb-4 mx-auto">
                                            <BriefcaseBusinessIcon className="text-zinc-700 dark:text-zinc-500" />
                                        </div>
                                        <span className="font-bold text-zinc-700 dark:text-zinc-500">
                                            No experience data added
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </motion.div>
            </div>
            <ConnectionDialogs
                isOpen={connectionsDialog.isOpen}
                onOpenChange={(isOpen) =>
                    setConnectionsDialog({ ...connectionsDialog, isOpen })
                }
                activeTab={connectionsDialog.activeTab}
                username={userName}
                setActiveTab={(tab) =>
                    setConnectionsDialog({
                        ...connectionsDialog,
                        activeTab: tab,
                    })
                }
            />
        </div>
    )
}
export default ProfilePreview
