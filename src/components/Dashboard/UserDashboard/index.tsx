import { AnimatePresence, motion } from "framer-motion"
import { Bell, Briefcase, Calendar, Home, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { axiosPrivate } from "@/config/axiosInstance"
import { useAuthStore } from "@/store/auth"

import { useConversationStore } from "./Chat/conversationStore"
import Sidebar from "./Sidebar"

export default function Index() {
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    // const [isNavbarVisible, setIsNavbarVisible] = useState(true)
    // const [lastScrollY, setLastScrollY] = useState(0)
    const { user } = useAuthStore()
    const profileImageUrl = user?.profile_image
    const { selectedConversation } = useConversationStore()
    useEffect(() => {
        // Update conditions to hide header based on specific URL segments
        const hideHeader = location.pathname.includes("direct/inbox")

        setIsHeaderVisible(!hideHeader)
    }, [location.pathname])

    //optional
    //GOAL:This code causes the header to disappear when scrolling down.
    //BUG : oscillation of the header when scrolling down at the start and end of the page.
    //FIX : try to fix
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const currentScrollY = window.scrollY
    //         if (currentScrollY > lastScrollY && currentScrollY > 10) {
    //             setIsHeaderVisible(false)
    //             setIsNavbarVisible(false)
    //         } else {
    //             setIsHeaderVisible(true)
    //             setIsNavbarVisible(true)
    //         }
    //         setLastScrollY(currentScrollY)
    //     }

    //     window.addEventListener("scroll", handleScroll)
    //     return () => window.removeEventListener("scroll", handleScroll)
    // }, [lastScrollY])

    const navItems = [
        { path: "/dashboard", icon: Home, label: "Home" },
        { path: "/dashboard/job-portal", icon: Briefcase, label: "Jobs" },
        { path: "/dashboard/events", icon: Calendar, label: "Events" },
        {
            path: "/dashboard/notifications",
            icon: Bell,
            label: "Notifications",
        },
        { path: "/dashboard/direct/inbox", icon: MessageCircle, label: "Chat" },
    ]

    return (
        <div className="flex min-h-screen bg-background text-foreground lg:pl-0">
            <Sidebar
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            <div className="flex-1 flex flex-col xm:ml-16 sm:ml-24 xl:ml-64">
                <motion.header
                    className={`bg-background  xl:hidden border-border p-4 ${!isHeaderVisible && "hidden"} flex items-center justify-between sticky top-0 z-30`}
                    initial={{ y: 0 }}
                    animate={{ y: isHeaderVisible ? 0 : -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className="flex items-center xm:w-16">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="xm:hidden rounded-full"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <img
                                src={`${axiosPrivate.defaults.baseURL}/${profileImageUrl}`}
                                alt="Profile"
                                className="rounded-full w-9 h-9 object-cover"
                            />
                        </Button>
                    </div>

                    <div className="flex-1 text-left pl-3 xm:pl-0 xm:text-center">
                        <h1 className="xl:hidden font-bold text-xl font-philosopher whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            gradSpace
                        </h1>
                    </div>

                    <div className="xm:w-16" />
                </motion.header>

                <main
                    className={`flex-1  overflow-auto p-0 sm:p-0 w-full  ${isHeaderVisible && "pb-14"}`}
                >
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </main>

                <motion.nav
                    className={`xm:hidden ${!isHeaderVisible && selectedConversation && "hidden"} fixed bottom-0 -mb-3 pb-2 left-0 right-0 bg-background/95 backdrop-blur border-t-2 border-gray-300  dark:border-primary-foreground border-border/40 z-30 shadow-sm`}
                    initial={{ y: 0 }}
                    // animate={{
                    //     y: isNavbarVisible ? 0 : 100,
                    //     opacity: isNavbarVisible ? 1 : 0.7,
                    // }}
                    transition={{
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        opacity: { duration: 0.2 },
                    }}
                >
                    <div className="grid grid-cols-5 gap-1 px-2 py-3 ">
                        {navItems.map(({ path, icon: Icon }) => {
                            const isActive = location.pathname === path
                            return (
                                <Link
                                    key={path}
                                    to={path}
                                    className="flex items-center justify-center"
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="default"
                                            className="h-12 w-full flex flex-col gap-1 rounded-xl transition-colors duration-200 hover:bg-accent/30 active:bg-accent/40"
                                        >
                                            <div className="relative">
                                                <Icon
                                                    className={`h-6 w-6 transition-colors ${
                                                        isActive
                                                            ? "text-primary"
                                                            : "text-muted-foreground"
                                                    }`}
                                                    style={{
                                                        width: "1.5rem",
                                                        height: "1.5rem",
                                                    }}
                                                />
                                                {isActive && (
                                                    <motion.div
                                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 500,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </Button>
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </div>
                </motion.nav>
            </div>
        </div>
    )
}
