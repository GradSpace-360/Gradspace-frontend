"use client"
import React, { useRef } from "react"
import { useMotionValueEvent, useScroll } from "framer-motion"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const StickyScroll = ({
    content,
}: {
    content: {
        title: string
        description: string
    }[]
    contentClassName?: string
}) => {
    const [activeCard, setActiveCard] = React.useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        container: ref,
        offset: ["start start", "end start"],
    })
    const cardLength = content.length

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength)
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint)
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index
                }
                return acc
            },
            0
        )
        setActiveCard(closestBreakpointIndex)
    })

    const backgroundColors = [
        "var(--violet-500)",
        "var(--violet-600)",
        "var(--violet-700)",
        "var(--violet-800)",
    ]

    return (
        <motion.div
            className="h-[30rem] overflow-y-auto flex justify-center  relative space-x-10 rounded-md p-10 scrollbar-hide"
            ref={ref}
        >
            <div className="div relative flex items-start   px-4">
                <div className="max-w-3xl  ">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-20">
                            <motion.h2
                                className={cn(
                                    "text-4xl font-bold mb-10 font-philosopher  ",
                                    activeCard === index
                                        ? "opacity-100 text-black dark:text-white"
                                        : "opacity-20 text-slate-900 dark:text-slate-100"
                                )}
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                className={cn(
                                    "text-2xl mb-10 font-semibold font-philosopher",
                                    activeCard === index
                                        ? "opacity-100 text-slate-700 dark:text-slate-300"
                                        : "opacity-20 text-slate-700 dark:text-slate-300"
                                )}
                            >
                                {item.description}
                            </motion.p>
                        </div>
                    ))}
                </div>
            </div>
            <motion.div
                className="hidden lg:block h-60 w-80 rounded-md bg-white sticky top-10 overflow-hidden"
                style={{
                    backgroundColor:
                        backgroundColors[activeCard % backgroundColors.length],
                }}
            ></motion.div>
        </motion.div>
    )
}
export default StickyScroll
