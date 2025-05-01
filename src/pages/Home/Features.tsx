import { AnimatePresence, motion, useAnimation, useInView } from "framer-motion"
import {
    BookOpen,
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Maximize2,
    MessageCircle,
    Network,
    ShieldCheck,
    Users,
    X,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

import admin from "@/assets/features/admin.png"
import messagingImg from "@/assets/features/connections_chat1.png"
import eventBoardImg from "@/assets/features/event_board1.png"
import jobPortalImg from "@/assets/features/job_board1.png"
import projectShowcaseImg from "@/assets/features/project_shelf1.png"
import smartConnectImg from "@/assets/features/smart_connect1.png"
// Import feature screenshots
import socialNetworkImg from "@/assets/features/social_network.png"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const features = [
    {
        icon: <Users className="h-10 w-10" />,
        title: "Alumni Social Network",
        description:
            "Connect with fellow graduates through an intuitive social platform that lets you share updates, achievements, and memories. Like, comment, and stay connected with your college community.",
        image: socialNetworkImg,
        color: "from-blue-500/20 to-indigo-500/20",
        textColor: "text-blue-600 dark:text-blue-400",
        buttonColor:
            "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800",
        link: "#social-network",
        benefits: [
            "Stay updated with peers",
            "Share professional milestones",
            "Reconnect with classmates",
        ],
    },
    {
        icon: <Network className="h-10 w-10" />,
        title: "Smart Connect",
        description:
            "Easily discover alumni and students who share your interests, skills, or background. Use filters such as department, graduation year, and skill set to find relevant profiles. Whether you're looking for mentors, collaborators, or just familiar faces, Smart Connect helps you build meaningful connections within your academic community.",
        image: smartConnectImg,
        color: "from-violet-500/20 to-purple-500/20",
        textColor: "text-violet-600 dark:text-violet-400",
        buttonColor:
            "bg-violet-600 hover:bg-violet-700 dark:bg-violet-700 dark:hover:bg-violet-800",
        link: "#smart-connect",
        benefits: [
            "Find mentors in your field",
            "Connect with like-minded alumni",
            "Discover new professional opportunities",
        ],
    },
    {
        icon: <Briefcase className="h-10 w-10" />,
        title: "Job Portal",
        description:
            "Access a dedicated job board featuring career opportunities posted by alumni and faculty members. Whether you're a fresh graduate or an experienced professional, discover internships, full-time roles, and referral opportunities tailored to your field of study. Apply directly through the portal and take a step forward in your career.",
        image: jobPortalImg,
        color: "from-green-500/20 to-emerald-500/20",
        textColor: "text-green-600 dark:text-green-400",
        buttonColor:
            "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
        link: "#job-portal",
        benefits: [
            "Apply to exclusive positions",
            "Post roles with alumni and faculty",
            "Report misleading job content",
            "Filter by location, role & company",
        ],
    },
    {
        icon: <BookOpen className="h-10 w-10" />,
        title: "Project Showcase",
        description:
            "Highlight your creative and academic accomplishments in one place. Share your projects with clear descriptions and useful links. From coding portfolios to design case studies and research innovations, explore a gallery of inspiring work contributed by students and alumni across batches.",
        image: projectShowcaseImg,
        color: "from-orange-500/20 to-amber-500/20",
        textColor: "text-orange-600 dark:text-orange-400",
        buttonColor:
            "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800",
        link: "#project-showcase",
        benefits: [
            "Display your portfolio",
            "Get feedback from peers",
            "Find collaborators for new projects",
        ],
    },
    {
        icon: <Calendar className="h-10 w-10" />,
        title: "Event Board",
        description:
            "Stay up-to-date with college and alumni events. Discover upcoming reunions, workshops and campus happenings. Mark your calendar, register for events, and relive the campus vibe—no matter where you are.",
        image: eventBoardImg,
        color: "from-red-500/20 to-pink-500/20",
        textColor: "text-red-600 dark:text-red-400",
        buttonColor:
            "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
        link: "#event-board",
        benefits: [
            "Stay updated on reunions",
            "Calendar integration",
            "Report irrelevant event posts",
        ],
    },
    {
        icon: <MessageCircle className="h-10 w-10" />,
        title: "Peer Connection & Chat",
        description:
            "Connect one-on-one with students and alumni through real-time messaging. Ask questions, offer guidance, or just catch up with friends. Our secure chat system supports private conversations to help you maintain strong personal and professional relationships.",
        image: messagingImg,
        color: "from-cyan-500/20 to-blue-500/20",
        textColor: "text-cyan-600 dark:text-cyan-400",
        buttonColor:
            "bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800",
        link: "#messaging",
        benefits: [
            "Secure real-time messaging",
            "Conversations with verified users",
            "Report misuse directly to admin",
        ],
    },
    {
        icon: <ShieldCheck className="h-10 w-10" />,
        title: "Admin Control & Moderation",
        description:
            "Maintain platform safety with tools for spam reporting, controlled user registration, and effective user management.",
        image: admin,
        color: "from-gray-500/20 to-gray-700/20",
        textColor: "text-gray-600 dark:text-gray-400",
        buttonColor:
            "bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800",
        link: "#admin-control",
        benefits: [
            "Spam Reporting: Report inappropriate content",
            "User Registration: Approve or reject new users",
            "User Management: Remove violators",
        ],
    },
]

// Feature Modal for fullscreen view
interface FeatureModalProps {
    feature: Feature
    isOpen: boolean
    onClose: () => void
}

const FeatureModal: React.FC<FeatureModalProps> = ({
    feature,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25 }}
                        className="relative w-full max-w-6xl max-h-[90vh] overflow-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 rounded-full bg-white/80 dark:bg-black/80 shadow-md hover:bg-white dark:hover:bg-black"
                        >
                            <X className="h-5 w-5" />
                        </Button>

                        <div className="grid md:grid-cols-2 h-full">
                            <div className="relative h-[300px] md:h-auto overflow-hidden">
                                <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="object-cover w-full h-full"
                                />
                                <div
                                    className={`absolute inset-0 bg-gradient-to-t ${feature.color.replace("/20", "/40")} mix-blend-overlay`}
                                />
                            </div>

                            <div className="p-6 md:p-10 flex flex-col">
                                <div className="mb-6 flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-xl w-14 h-14 flex items-center justify-center bg-gradient-to-br ${feature.color}`}
                                    >
                                        <div className={feature.textColor}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold font-philosopher text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                </div>

                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 mb-8">
                                    <h4 className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">
                                        Key Benefits
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {feature.benefits.map((benefit, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className={`px-4 py-2 ${feature.textColor} border-current text-sm`}
                                            >
                                                {benefit}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Button
                                        className={cn(
                                            "w-full gap-2",
                                            feature.buttonColor
                                        )}
                                        size="lg"
                                        variant="default"
                                        asChild
                                    >
                                        {/* <a href={feature.link}>
                                            Explore {feature.title}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a> */}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Feature carousel
const FeatureCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [modalOpen, setModalOpen] = useState(false)

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % features.length)
    }

    const handlePrev = () => {
        setActiveIndex(
            (prevIndex) => (prevIndex - 1 + features.length) % features.length
        )
    }

    // Touch handlers for mobile swipe
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 70) {
            handleNext()
        }
        if (touchEnd - touchStart > 70) {
            handlePrev()
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (!modalOpen) {
                handleNext()
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [modalOpen])

    const feature = features[activeIndex]

    return (
        <div
            className="w-full overflow-hidden relative mt-12 px-2 md:px-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 md:p-10 flex flex-col justify-between">
                        <div>
                            <div
                                className={`w-16 h-16 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg transform transition-transform hover:scale-105 hover:rotate-3`}
                            >
                                <div className={`${feature.textColor}`}>
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-philosopher text-gray-900 dark:text-white leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                {feature.description}
                            </p>

                            <div className="space-y-3 mb-8">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    Key Benefits:
                                </h4>
                                <ul className="space-y-2">
                                    {feature.benefits.map((benefit, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full ${feature.textColor.replace("text", "bg")}`}
                                            ></span>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <Button
                            className={cn(
                                "mt-auto self-start gap-2",
                                feature.buttonColor
                            )}
                            variant="default"
                            onClick={() => setModalOpen(true)}
                        >
                            Explore {feature.title}
                            <Maximize2 className="ml-1 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="relative h-[300px] md:h-auto overflow-hidden bg-gray-100 dark:bg-gray-900 group">
                        <img
                            src={feature.image}
                            alt={feature.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        <div
                            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-transparent to-transparent`}
                        />
                        <Button
                            variant="ghost"
                            className="absolute bottom-4 right-4 text-white bg-black/40 hover:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                            size="sm"
                            onClick={() => setModalOpen(true)}
                        >
                            <Maximize2 className="mr-2 h-4 w-4" /> View Larger
                        </Button>
                    </div>
                </div>
            </motion.div>

            <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 px-4">
                <Button
                    onClick={handlePrev}
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                    onClick={handleNext}
                    size="icon"
                    variant="ghost"
                    className="h-12 w-12 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            <div className="flex justify-center mt-8 gap-2">
                {features.map((_, index) => (
                    <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className={`w-3 h-3 p-0 rounded-full ${
                            index === activeIndex
                                ? `bg-${feature.textColor.split("-")[1].split("/")[0]}-600`
                                : "bg-gray-300 dark:bg-gray-700"
                        } transition-all duration-300 hover:scale-125`}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>

            <FeatureModal
                feature={feature}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    )
}

// Animated feature cards
interface Feature {
    icon: React.ReactNode
    title: string
    description: string
    image: string
    color: string
    textColor: string
    buttonColor: string
    link: string
    benefits: string[]
}
interface FeatureCardProps {
    feature: Feature
    index: number
}
const FeatureCard = ({ feature, index }: FeatureCardProps) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })
    const controls = useAnimation()
    const [isHovered, setIsHovered] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        if (isInView) {
            controls.start("visible")
        }
    }, [isInView, controls])

    return (
        <>
            <motion.div
                ref={ref}
                variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={controls}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full perspective-1000"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <Card className="group h-full overflow-hidden transition-all duration-500 hover:shadow-2xl dark:hover:shadow-primary/25 hover:-translate-y-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 relative">
                    <div
                        className={`h-2 w-full bg-gradient-to-r ${feature.color.replace("/20", "/50")}`}
                    ></div>

                    <div
                        className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-all duration-700 group-hover:opacity-30 group-hover:rotate-45 pointer-events-none"
                        style={{
                            background: `linear-gradient(to bottom right, var(--${feature.textColor.split("-")[1]}-500), var(--${feature.textColor.split("-")[1]}-700))`,
                        }}
                    ></div>

                    <CardContent className="p-6 flex flex-col h-full">
                        <div className="mb-5 flex-1">
                            <motion.div
                                animate={
                                    isHovered
                                        ? { scale: 1.1, rotate: 5 }
                                        : { scale: 1, rotate: 0 }
                                }
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`p-3 rounded-xl mb-5 w-16 h-16 flex items-center justify-center bg-gradient-to-br ${feature.color} shadow-md`}
                            >
                                <div className={feature.textColor}>
                                    {feature.icon}
                                </div>
                            </motion.div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 font-philosopher text-gray-900 dark:text-gray-100">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-300 line-clamp-3">
                                {feature.description}
                            </p>
                        </div>

                        <motion.div
                            animate={
                                isHovered
                                    ? { y: 0, opacity: 1 }
                                    : { y: 10, opacity: 0 }
                            }
                            transition={{ duration: 0.3 }}
                            className="mt-0 space-y-1.5 mb-0"
                        >
                            {feature.benefits.slice(0, 2).map((benefit, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full mt-1.5 ${feature.textColor.replace("text", "bg")}`}
                                    ></span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {benefit}
                                    </span>
                                </div>
                            ))}
                            {feature.benefits.length > 2 && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 pl-3.5">
                                    +{feature.benefits.length - 2} more
                                </span>
                            )}
                        </motion.div>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 mt-auto">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full gap-2 transition-all duration-300 group-hover:font-medium",
                                feature.textColor,
                                isHovered && "bg-opacity-10 bg-current"
                            )}
                            onClick={() => setModalOpen(true)}
                        >
                            Learn more <ExternalLink className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <FeatureModal
                feature={feature}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    )
}

export default function Features() {
    return (
        <section id="features" className="w-full py-20 ">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold font-philosopher tracking-tighter sm:text-5xl mb-6 text-gray-900 dark:text-gray-100">
                        <span className="inline-block px-6 py-2 transform -rotate-1 bg-gradient-to-r from-violet-100 to-violet-200 dark:from-violet-900/20 dark:to-black rounded-lg">
                            <span className="transform rotate-1 inline-block">
                                Platform Features
                            </span>
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Everything you need to connect, grow, and thrive with
                        your alumni community
                    </p>
                </motion.div>

                {/* Featured highlight - Carousel */}
                <FeatureCarousel />

                {/* All features grid */}
                <div className="mt-32">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold font-philosopher mb-4 text-center text-gray-900 dark:text-gray-100">
                            All Platform Features
                        </h3>
                        <div className="w-20 h-1 mx-auto bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mb-12"></div>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:max-w-full max-w-sm mx-auto">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                feature={feature}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
