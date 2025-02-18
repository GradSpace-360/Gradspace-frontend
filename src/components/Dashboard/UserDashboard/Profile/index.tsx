import { motion } from "framer-motion"
import { Github, Link2, Star } from "lucide-react"
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

import { TimelineItem } from "./TimeLineItem"

interface ProfilePreviewProps {
    userName: string
}

const ProfilePreview = ({ userName }: ProfilePreviewProps) => {
    const [activeTab, setActiveTab] = useState<
        "POSTS" | "EDUCATION" | "EXPERIENCE"
    >("POSTS")
    const { user: authUser } = useAuthStore()
    const { profileData, loading, error, fetchProfile } = useProfileStore()
    const navigate = useNavigate()

    useEffect(() => {
        fetchProfile(userName)
    }, [userName, fetchProfile])

    if (loading) return <div></div>
    if (error) return <div className="text-red-500 p-8">{error}</div>
    if (!profileData) return null

    const { user, profile, educations, experiences, socialLinks } = profileData
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
                        {/* <div className="flex items-start gap-8">

                            <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full p-[2px] bg-gradient-to-tr from-black dark:from-white via-black/30 dark:to-white to-gray-400">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    <img
                                        src={`${axiosPrivate.defaults.baseURL}/${profile.profileImage}`}
                                        alt="Profile picture"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                                    <div>
                                        <h2 className="text-xl">
                                            {user.fullName}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            @{userName}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        {isCurrentUser ? (
                                            <Button className="">
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <>
                                                <Button className="">
                                                    Follow
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className=""
                                                >
                                                    Message
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-8 my-4">
                                    <div className="text-center sm:text-left">
                                        <span className="font-semibold">0</span>{" "}
                                        posts
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <span className="font-semibold">
                                            {educations.length}
                                        </span>{" "}
                                        educations
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <span className="font-semibold">
                                            {experiences.length}
                                        </span>{" "}
                                        experiences
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h1 className="font-semibold">
                                        {profile.headline}
                                    </h1>
                                    <p className="text-zinc-700 dark:text-zinc-300">
                                        {profile.about}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {profile.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 rounded-full bg-primary-foreground text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {profile.interests.map(
                                            (interest, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded-full bg-primary-foreground text-sm flex items-center gap-1"
                                                >
                                                    <Star className="h-4 w-4" />{" "}
                                                    {interest}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div> */}
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
                                                >
                                                    Follow
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    className="flex-1 sm:flex-none"
                                                    size="sm"
                                                >
                                                    Message
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-4 my-3 sm:my-4">
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">0</span>
                                        <span className="text-sm text-muted-foreground">
                                            posts
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">
                                            {educations.length}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            educations
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-semibold">
                                            {experiences.length}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            experiences
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
                                    {/* <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1  rounded-sm  bg-primary-foreground text-xs sm:text-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}

                                        {profile.interests.map(
                                            (interest, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded-sm bg-primary-foreground text-xs sm:text-sm flex items-center gap-1"
                                                >
                                                    <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    {interest}
                                                </span>
                                            )
                                        )}
                                    </div> */}

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
                                <div className="grid grid-cols-3 gap-1">
                                    {Array.from({ length: 9 }).map(
                                        (
                                            _,
                                            index // Dummy posts
                                        ) => (
                                            <div
                                                key={index}
                                                className="aspect-square bg-zinc-800"
                                            >
                                                <img
                                                    src="/placeholder.svg"
                                                    alt={`Post ${index + 1}`}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {activeTab === "EDUCATION" && (
                                <div className="pl-4">
                                    {educations.map((edu, index) => (
                                        <TimelineItem
                                            key={index}
                                            title={edu.course}
                                            subtitle={edu.institutionName}
                                            location={edu.location}
                                            start={formatDate(edu.startDate)}
                                            end={formatDate(edu.endDate)}
                                            details={`Grade: ${edu.grade}`}
                                            type="EDUCATION"
                                        />
                                    ))}
                                </div>
                            )}
                            {activeTab === "EXPERIENCE" && (
                                <div className="pl-4">
                                    {experiences.map((exp, index) => (
                                        <TimelineItem
                                            key={index}
                                            title={exp.position}
                                            subtitle={exp.companyName}
                                            location={`${exp.location} · ${exp.jobType}`}
                                            start={formatDate(exp.startDate)}
                                            end={
                                                exp.endDate
                                                    ? formatDate(exp.endDate)
                                                    : "Present"
                                            }
                                            details={exp.locationType}
                                            type="EXPERIENCE"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
export default ProfilePreview
