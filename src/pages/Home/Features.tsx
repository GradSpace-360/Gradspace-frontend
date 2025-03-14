import { motion } from "framer-motion"
import {
    BookOpen,
    Briefcase,
    Calendar,
    MessageCircle,
    Network,
    // ShoppingBag,
    Users,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const features = [
    {
        icon: <Users className="h-12 w-12" />,
        title: "Alumni Social Network",
        description:
            "Connect, like, and comment on posts from fellow college alumni.",
    },
    {
        icon: <MessageCircle className="h-12 w-12" />,
        title: "Peer Connection & Chat",
        description:
            "Build relationships and chat privately with other alumni.",
    },
    {
        icon: <Briefcase className="h-12 w-12" />,
        title: "Job Portal",
        description: "Find and post job opportunities exclusively for alumni.",
    },

    {
        icon: <BookOpen className="h-12 w-12" />,
        title: "Project Showcase",
        description:
            "Display and explore innovative projects from talented alumni.",
    },
    {
        icon: <Calendar className="h-12 w-12" />,
        title: "Event Board",
        description:
            "Stay updated with alumni gatherings and networking events.",
    },
    {
        icon: <Network className="h-12 w-12" />,
        title: "Smart Connect",
        description:
            "Connect with like-minded alumni and students using filters.",
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
}

export default function Features() {
    return (
        <section id="features" className="w-full py-20">
            <div className="container px-4 md:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold font-philosopher tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-gray-100"
                >
                    <span className="inline-block px-4 transform -skew-y-2 bg-violet-200 dark:bg-[#080909] font-bold font-philosopher">
                        <span className="transform skew-y-2 inline-block">
                            Key Features
                        </span>
                    </span>
                </motion.h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:max-w-full max-w-sm mx-auto"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/25 hover:-translate-y-2 bg-[#ffffff] dark:bg-[#161716] border-gray-200 border-2 dark:border-gray-800 h-full">
                                <CardContent className="flex flex-col items-center space-y-4 p-6 justify-between">
                                    <motion.div
                                        whileHover={{
                                            scale: 1.2,
                                            rotate: 360,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                        }}
                                        className="p-3 rounded-full bg-primary/10 text-primary dark:bg-[#1d1d1d] dark:text-white group-hover:bg-primary group-hover:text-white dark:group-hover:bg-[#080909] dark:group-hover:text-white"
                                    >
                                        {feature.icon}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-center group-hover:text-primary transition-colors duration-300 text-[#000054] font-philosopher dark:text-gray-100">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
