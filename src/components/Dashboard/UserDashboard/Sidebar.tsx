import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { AnimatePresence, motion } from "framer-motion"
import {
    Bell,
    Briefcase,
    Calendar,
    Home,
    Layers,
    LogOut,
    Mail,
    Moon,
    Search,
    Settings,
    Sun,
    User,
} from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet"
import { axiosPrivate } from "@/config/axiosInstance"
import { useTheme } from "@/context/ThemProvider"
import { useAuthStore } from "@/store/auth"

interface SidebarProps {
    isMobileMenuOpen: boolean
    setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const navLinks = (user: { username?: string } | null) => [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/dashboard/explore", icon: Search, label: "Explore" },
    { to: "/dashboard/job-portal", icon: Briefcase, label: "Job Portal" },
    { to: "/dashboard/events", icon: Calendar, label: "Events" },
    { to: "/dashboard/projects", icon: Layers, label: "Project Shelf" },
    { to: "/dashboard/chat", icon: Mail, label: "Chat" },
    { to: "/dashboard/notifications", icon: Bell, label: "Notifications" },
    {
        to: `/dashboard/profile/${user?.username}`,
        icon: User,
        label: "Profile",
    },
]

const SidebarContent = ({
    isMobile,
    onClose,
}: {
    isMobile: boolean
    onClose: () => void
}) => {
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
        onClose()
    }
    const profileImageUrl = user?.profile_image
    const actionButtons = [
        {
            icon: theme === "dark" ? Sun : Moon,
            label: theme === "light" ? "Dark Mode" : "Light Mode",
            onClick: toggleTheme,
            isTheme: true,
        },
        { icon: LogOut, label: "Logout", onClick: handleLogout },
    ]

    return (
        <motion.div
            className={`flex flex-col h-full font-roboto ${isMobile ? "font-bold" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            <div className="  xl:block pt-10 pb-10  pl-2 xl:px-10 px-2">
                <h1 className="font-bold text-2xl    font-philosopher whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    <span className="inline xm:hidden xl:inline">
                        {" "}
                        gradSpace
                    </span>
                    <span className="hidden xm:inline xl:hidden">
                        <img src="/new_logo1.svg" alt="" width={50} />
                    </span>
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-2">
                {navLinks(user).map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/dashboard"}
                        className={({ isActive }) =>
                            `block font-philosopher  relative ${isActive ? "text-primary" : "text-muted-foreground"}`
                        }
                        onClick={onClose}
                    >
                        {({ isActive }) => (
                            <motion.div
                                whileHover={{ scale: 1 }}
                                whileTap={{ scale: 0.995 }}
                                className="relative"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 w-[3px] h-full bg-primary rounded-r-full"
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    />
                                )}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start xl:justify-start xm:justify-center xl:px-10 px-2 text-lg hover:bg-accent/50"
                                >
                                    {link.label === "Profile" ? (
                                        profileImageUrl ? (
                                            <img
                                                src={`${axiosPrivate.defaults.baseURL}/${profileImageUrl}`}
                                                alt=""
                                                style={{
                                                    width: "1.5rem",
                                                    height: "1.5rem",
                                                }}
                                                className="rounded-full mr-1 h-7 w-7 border-2 border-primary"
                                            />
                                        ) : (
                                            <div className=" rounded-full overflow-hidden mr-1 h-7 w-7 border-2 border-primary">
                                                <img
                                                    src="/user_avatar.png"
                                                    alt="Default avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )
                                    ) : (
                                        <link.icon
                                            style={{
                                                width: "1.18rem",
                                                height: "1.18rem",
                                            }}
                                            className="mr-2 h-7 w-7"
                                        />
                                    )}
                                    <motion.span
                                        className="inline xm:hidden xl:inline"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        {link.label}
                                    </motion.span>
                                </Button>
                            </motion.div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-2">
                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `block relative ${isActive ? "text-primary" : "text-muted-foreground"}`
                    }
                    onClick={onClose}
                >
                    {() => (
                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start xl:justify-start xm:justify-center xl:px-10 px-2 text-lg hover:bg-accent/50"
                            >
                                <Settings
                                    style={{
                                        width: "1.18rem",
                                        height: "1.18rem",
                                    }}
                                    className="mr-2 h-6 w-6"
                                />{" "}
                                <motion.span
                                    className="inline xm:hidden xl:inline font-philosopher"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Settings
                                </motion.span>
                            </Button>
                        </motion.div>
                    )}
                </NavLink>

                {actionButtons.map((button) => (
                    <motion.div key={button.label} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start xl:justify-start xm:justify-center xl:px-10 px-2 text-lg hover:bg-accent/50 hover:text-primary  text-muted-foreground"
                            onClick={button.onClick}
                            aria-label={
                                button.isTheme ? "Toggle theme" : undefined
                            }
                        >
                            <motion.div>
                                <button.icon
                                    style={{
                                        width: "1.18rem",
                                        height: "1.18rem",
                                    }}
                                    className="mr-2 h-6 w-6 "
                                />{" "}
                            </motion.div>
                            <motion.span
                                className="inline xm:hidden xl:inline hover:text-primary text-muted-foreground font-philosopher"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {button.label}
                            </motion.span>
                        </Button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

const Sidebar: React.FC<SidebarProps> = ({
    isMobileMenuOpen,
    setIsMobileMenuOpen,
}) => {
    const closeMenu = () => setIsMobileMenuOpen(false)

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                className=" hidden xm:flex xm:flex-col xm:w-16 sm:w-20 xl:w-64 bg-card border-r border-border fixed h-full transition-all duration-0"
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                exit={{ x: -100 }}
            >
                <SidebarContent isMobile={false} onClose={closeMenu} />
            </motion.aside>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <SheetContent
                            side="left"
                            className="w-64 p-0 bg-card"
                            forceMount
                        >
                            <VisuallyHidden>
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>
                                    Use the navigation to switch between
                                    dashboard sections.
                                </SheetDescription>
                            </VisuallyHidden>
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "tween", duration: 0.2 }}
                                className="h-full"
                            >
                                <SidebarContent
                                    isMobile={true}
                                    onClose={closeMenu}
                                />
                            </motion.div>
                        </SheetContent>
                    )}
                </AnimatePresence>
            </Sheet>
        </>
    )
}

export default Sidebar
