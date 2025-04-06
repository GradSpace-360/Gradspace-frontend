import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Menu, Moon, Sun, X } from "lucide-react"
import * as React from "react"
import {
    BarChart,
    Briefcase,
    FileText,
    Folder,
    LogOut,
    UserPlus,
    Users,
} from "react-feather"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTheme } from "@/context/ThemProvider"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth"

interface AdminSidebarProps {
    selectedFeature: string | null
    setSelectedFeature: (feature: string) => void
}

const menuItems = [
    { name: "users", icon: Users, label: "User Management" },
    { name: "requests", icon: UserPlus, label: "Request Management" },
    { name: "analytics", icon: BarChart, label: "Analytics" },
    { name: "jobs", icon: Briefcase, label: "Jobs Management" },
    { name: "events", icon: Folder, label: "Event Moderation" },
    { name: "post", icon: FileText, label: "Post Moderation" },
]

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
    selectedFeature,
    setSelectedFeature,
}) => {
    const { logout } = useAuthStore()
    const navigate = useNavigate()
    const [isExpanded, setIsExpanded] = React.useState(true)
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)
    const { theme, toggleTheme } = useTheme()

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsMobileOpen(!isMobileOpen)
        } else {
            setIsExpanded(!isExpanded)
        }
    }

    const sidebarContent = (
        <motion.div
            className={cn(
                "flex h-screen flex-col bg-background border-r",
                isExpanded ? "w-64" : "w-16",
                "transition-all duration-100 ease-in-out"
            )}
            initial={false}
            animate={{ width: isExpanded ? 256 : 64 }}
        >
            <div className="flex h-16 items-center justify-between px-4 py-4">
                <motion.span
                    initial={false}
                    animate={{ opacity: isExpanded ? 1 : 0 }}
                    className="font-semibold font-philosopher  text-xl overflow-hidden whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                >
                    gradSpace
                </motion.span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={toggleSidebar}
                >
                    {isExpanded ? (
                        <ChevronLeft className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Button>
            </div>

            <TooltipProvider delayDuration={0}>
                <nav className="flex-1 space-y-2 p-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            selectedFeature === item.name
                                                ? "secondary"
                                                : "link"
                                        }
                                        className={cn(
                                            "w-full justify-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:no-underline",
                                            !isExpanded && "justify-center"
                                        )}
                                        onClick={() => {
                                            setSelectedFeature(item.name)
                                            if (window.innerWidth < 768) {
                                                setIsMobileOpen(false)
                                            }
                                        }}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {isExpanded && (
                                            <motion.span
                                                initial={false}
                                                animate={{ opacity: 1 }}
                                                className="overflow-hidden whitespace-nowrap font-philosopher text-base"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                {!isExpanded && (
                                    <TooltipContent side="right">
                                        {item.label}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        )
                    })}
                </nav>
            </TooltipProvider>

            {/* Theme Toggle Button */}
            <div className=" p-4 space-y-4">
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "w-full justify-start gap-2",
                                    !isExpanded && "justify-center"
                                )}
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                            >
                                {theme === "light" ? (
                                    <Moon className="h-4 w-4" />
                                ) : (
                                    <Sun className="h-4 w-4" />
                                )}
                                {isExpanded && (
                                    <motion.span
                                        initial={false}
                                        animate={{ opacity: 1 }}
                                        className="overflow-hidden whitespace-nowrap"
                                    >
                                        {theme === "light"
                                            ? "Dark Mode"
                                            : "Light Mode"}
                                    </motion.span>
                                )}
                            </Button>
                        </TooltipTrigger>
                        {!isExpanded && (
                            <TooltipContent side="right">
                                {theme === "light" ? "Dark Mode" : "Light Mode"}
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
                {/* logout button */}
                <TooltipProvider delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "w-full justify-start gap-2",
                                    !isExpanded && "justify-center"
                                )}
                                onClick={async () => {
                                    try {
                                        await logout()
                                        toast.success(
                                            "Successfully logged out!"
                                        )
                                        navigate("/login")
                                    } catch {
                                        toast.error(
                                            "Failed to log out. Please try again."
                                        )
                                    }
                                }}
                                aria-label="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                                {isExpanded && (
                                    <motion.span
                                        initial={false}
                                        animate={{ opacity: 1 }}
                                        className="overflow-hidden whitespace-nowrap"
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </Button>
                        </TooltipTrigger>
                        {!isExpanded && (
                            <TooltipContent side="right">Logout</TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </div>
        </motion.div>
    )

    return (
        <>
            <nav className="fixed md:hidden top-0 left-0 right-0 z-40 bg-background shadow-sm backdrop-blur-sm">
                <div className="container mx-auto flex h-12 items-center justify-between px-4">
                    {/* Hamburger Menu Button (Left) */}
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        {isMobileOpen ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Centered Text (GradSpace) */}
                    <div className="flex-1 text-center">
                        <span className="text-xl font-philosopher  font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            gradSpace
                        </span>
                    </div>

                    {/* Placeholder for Right Side (Optional) */}
                    <div className="w-10"></div>
                </div>
            </nav>

            {/* Desktop sidebar */}
            <div className="hidden md:block">{sidebarContent}</div>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{
                                type: "tween",
                                duration: 0.2,
                            }}
                            className="fixed inset-y-0 left-0 z-50 md:hidden"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
