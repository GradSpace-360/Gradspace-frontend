import { motion } from "framer-motion"
import {
    BriefcaseBusinessIcon,
    Calendar,
    GraduationCapIcon,
    MapPin,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface TimelineItemProps {
    title: string
    subtitle: string
    location: string
    start: string
    end: string
    details?: string
    type?: "EDUCATION" | "EXPERIENCE"
}

export const TimelineItem = ({
    title,
    subtitle,
    location,
    start,
    end,
    details,
    type = "EXPERIENCE",
}: TimelineItemProps) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative pl-8 md:pl-10 group"
    >
        {/* Timeline line */}
        <div className="absolute left-0 top-5 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-background" />

        {/* Timeline icon */}
        <div className="absolute left-0 top-2.5 z-10 -translate-x-1/2">
            <Card className="h-8 w-8 flex items-center justify-center p-1.5 bg-background border-primary/30 group-hover:border-primary transition-colors rounded-full">
                {type === "EDUCATION" ? (
                    <GraduationCapIcon className="h-5 w-5 text-primary" />
                ) : (
                    <BriefcaseBusinessIcon className="h-5 w-5 text-primary" />
                )}
            </Card>
        </div>

        {/* Content */}
        <Card className="p-6 ml-4 hover:bg-gradient-to-br from-background/50 via-accent/5 to-background transition-all duration-300 mb-5 group/card shadow-sm hover:shadow-lg border border-border/50 hover:border-primary/20">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2.5">
                    <motion.h4
                        whileHover={{ x: 2 }}
                        className="text-lg font-semibold tracking-tight bg-gradient-to-r from-primary/90 to-primary/60 bg-clip-text text-transparent"
                    >
                        {title}
                    </motion.h4>

                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-primary/50" />
                        {subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary/80" />
                            <span>{location}</span>
                        </div>
                        <Separator
                            orientation="vertical"
                            className="h-4 bg-border/40"
                        />
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-primary/80" />
                            <span>
                                {start} - {end}
                            </span>
                        </div>
                    </div>
                </div>

                {end === "Present" && (
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="md:mt-0.5"
                    >
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500 border border-green-500/30 flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                            Ongoing
                        </span>
                    </motion.div>
                )}
            </div>

            {details && (
                <>
                    <Separator className="my-4 bg-border/30" />
                    <p className="text-sm text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/20">
                        {details}
                    </p>
                </>
            )}
        </Card>
    </motion.div>
)
