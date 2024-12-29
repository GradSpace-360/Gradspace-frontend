"use client"

import { useState } from "react"
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { Link as ScrollLink } from "react-scroll" // For smooth scrolling
import { Link as RouterLink } from "react-router-dom" // For routing
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/ThemProvider"

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: { name: string; link: string; icon?: JSX.Element }[]
    className?: string
}) => {
    const { scrollYProgress } = useScroll()
    const [visible, setVisible] = useState(true)
    const { theme, toggleTheme } = useTheme()

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        if (typeof current === "number") {
            const direction = current - scrollYProgress.getPrevious()!

            if (scrollYProgress.get() < 0.05) {
                setVisible(true)
            } else {
                setVisible(direction < 0)
            }
        }
    })

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 1, y: 100 }}
                animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "flex max-w-fit fixed bottom-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
                    className
                )}
            >
                {navItems.map((navItem) => (
                    <ScrollLink
                        key={navItem.name}
                        to={navItem.link.replace("#", "")}
                        spy={true}
                        smooth={true}
                        duration={500}
                        className={cn(
                            "relative dark:text-neutral-50 items-center cursor-pointer flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                        )}
                    >
                        <span className="block sm:hidden">{navItem.icon}</span>
                        <span className="hidden sm:block text-sm">
                            {navItem.name}
                        </span>
                    </ScrollLink>
                ))}

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <RouterLink
                    to="/login"
                    className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                    <span>Login</span>
                    <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                </RouterLink>
            </motion.div>
        </AnimatePresence>
    )
}
