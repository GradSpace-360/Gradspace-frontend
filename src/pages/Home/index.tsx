import { motion, useScroll, useTransform } from "framer-motion"
import { lazy, Suspense, useState } from "react"
import { Link } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"

import alumniSvg from "@/assets/alumni2.png"
import alumniSvg2 from "@/assets/alumni3.png"
import collegeSvg from "@/assets/college.svg"
import IconContact from "@/assets/icons/IconContact"
import IconHome from "@/assets/icons/IconHome"
import IconInfoCircle from "@/assets/icons/IconInfoCircle"
import IconStar from "@/assets/icons/IconStar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const AnimatedShinyText = lazy(
    () => import("@/components/ui/animated-shiny-text")
)
const FloatingNav = lazy(() => import("@/components/ui/floating-navbar"))
const ShinyButton = lazy(() => import("@/components/ui/shiny-button"))
const StickyScroll = lazy(() => import("@/components/ui/sticky-scroll-reveal"))
const TracingBeam = lazy(() => import("@/components/ui/tracing-beam"))
const DotBackground = lazy(() => import("@/components/DotBackground"))
const TermsOfService = lazy(() => import("../TermsOfService"))
const Features = lazy(() => import("./Features"))
// const Testimonials = lazy(() => import("./Testimonials"))
const CampusGallery = lazy(() => import("./CampusGallary"))
const OptimizedImage = lazy(() => import("./OptimizedImage"))

const navItems = [
    {
        name: "Home",
        link: "#home",
        icon: <IconHome />,
    },
    {
        name: "About",
        link: "#about",
        icon: <IconInfoCircle />,
    },
    {
        name: "Features",
        link: "#features",
        icon: <IconStar />,
    },
    {
        name: "campus",
        link: "#gallery",
        icon: <IconContact />,
    },
]

export default function Home() {
    const [showTerms, setShowTerms] = useState(false)
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.2], [-0.5, 1])

    return (
        <Suspense fallback={<div></div>}>
            <TracingBeam>
                <div className="flex flex-col min-h-screen">
                    <DotBackground />
                    <FloatingNav navItems={navItems} />
                    <main className="flex-1">
                        {/* Hero Section */}
                        <section
                            className="flex items-center justify-center md:py-3 py-20 min-h-screen"
                            id="home"
                        >
                            <OptimizedImage
                                src={alumniSvg}
                                alt="Alumni"
                                className="hidden dark:sm:block h-[500px] mb-20"
                            />
                            <OptimizedImage
                                src={alumniSvg2}
                                alt="Alumni 2"
                                className="hidden dark:hidden sm:block h-[500px] mb-20"
                            />
                            <motion.div style={{ opacity }}>
                                <OptimizedImage
                                    src={collegeSvg}
                                    alt="College"
                                    className="hidden sm:block h-[500px] -z-10 top-0 fixed"
                                />
                            </motion.div>
                            <div className="container px-4 md:px-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="flex flex-col items-center space-y-4 text-center text-[#000000] dark:text-[#FFFEFE]"
                                >
                                    <h1 className="mb-6 text-4xl font-bold font-philosopher tracking-tighter sm:text-5xl md:text-6xl relative">
                                        <div>
                                            <span className="inline-block px-4 transform skew-y-2 rounded-bl-2xl bg-black/50 dark:bg-white/50 dark:text-black text-white/90">
                                                <span className="transform -skew-y-2 inline-block">
                                                    Simplify
                                                </span>
                                            </span>{" "}
                                            Your Alumni
                                        </div>
                                        <>
                                            Network,{" "}
                                            <span className="inline-block px-4 transform -skew-y-2 rounded-br-2xl bg-black/50 dark:bg-white/50 dark:text-black text-white/90">
                                                <span className="transform skew-y-2 inline-block">
                                                    Amplify
                                                </span>
                                            </span>
                                            <br />
                                            Connections
                                        </>
                                    </h1>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.4,
                                        }}
                                        className="max-w-[700px] mx-auto px-4"
                                    >
                                        <p className="text-base sm:text-lg md:text-xl font-philosopher text-gray-600 dark:text-white text-center">
                                            {" "}
                                            Why bridge the gap yourself when{" "}
                                            <span
                                                className={cn(
                                                    "inline-block px-4 transform -skew-y-2 bg-violet-200 dark:bg-black/70 rounded-md font-bold font-philosopher dark:text-white text-black"
                                                )}
                                            >
                                                {" "}
                                                <span className="transform p-1 skew-y-2 inline-block">
                                                    gradSpace
                                                </span>{" "}
                                            </span>{" "}
                                            does it for you? Explore{" "}
                                            <span className="font-medium">
                                                job opportunities
                                            </span>
                                            , build{" "}
                                            <span className="font-medium">
                                                peer connections
                                            </span>
                                            , and unlock meaningful
                                            collaborations – all through the
                                            power of{" "}
                                            <AnimatedShinyText>
                                                student-alumni synergy
                                            </AnimatedShinyText>
                                            . <br />
                                        </p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.6,
                                        }}
                                        className="gap-5 flex"
                                    >
                                        <Link to="/signup">
                                            <Button className="font-philosopher font-bold">
                                                {" "}
                                                Join the Network
                                            </Button>
                                        </Link>
                                        <ScrollLink
                                            to="about"
                                            spy={true}
                                            smooth={true}
                                            duration={500}
                                            className={cn(
                                                "relative dark:text-neutral-50 items-center cursor-pointer flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                                            )}
                                        >
                                            <ShinyButton className="font-philosopher font-bold">
                                                See How It Works
                                            </ShinyButton>
                                        </ScrollLink>
                                    </motion.div>
                                    <span className=" inline-block text-center w-full philosopher text-gray-900  dark:text-white font-philosopher ">
                                        College of Engineering Adoor
                                    </span>
                                </motion.div>
                            </div>
                        </section>

                        {/* About Section */}
                        <section id="about" className="py-20">
                            <div className="container mx-auto px-4">
                                <StickyScroll
                                    content={[
                                        {
                                            title: "About GradSpace",
                                            description:
                                                "In a world where social media tells the story of your life—whether through who you follow or the content you consume—there's a growing need for spaces that foster meaningful, purposeful connections. Gradspace was born from this realization.",
                                        },
                                        {
                                            title: "Bridging the Gap",
                                            description:
                                                "It's not just about scrolling through feeds; it's about actively shaping your journey. Gradspace is designed to connect students and alumni in a meaningful way, helping you bridge the gap between education and professional growth.",
                                        },
                                        {
                                            title: "Empowering Growth",
                                            description:
                                                "Whether you're a student looking for guidance, or an alum eager to give back, this platform creates a space where knowledge, experience, and opportunities can be shared without barriers.",
                                        },
                                        {
                                            title: "Taking Control",
                                            description:
                                                "With Gradspace, the future of your career is not left to chance. It's about empowering you, as a student or graduate, to make connections that can change your life, and in turn, contribute to the success of others.",
                                        },
                                    ]}
                                />
                            </div>
                        </section>

                        {/* Features Section */}
                        <Features />
                        {/* Campus Gallery Section */}
                        <section id="gallery">
                            <CampusGallery />
                        </section>

                        <section
                            id="contact"
                            className="w-full flex justify-center py-12 md:py-24 lg:py-32"
                        >
                            <div className="container px-4 md:px-6">
                                <div className="flex flex-col items-center space-y-4 text-center">
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-philosopher font-bold tracking-tighter sm:text-5xl">
                                            Join GradSpace Today
                                        </h2>
                                        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                            Start building your professional
                                            network and unlock new
                                            opportunities. Sign up now to
                                            connect with alumni and fellow
                                            graduates.
                                        </p>
                                    </div>
                                    <div className="w-full max-w-sm space-y-2">
                                        <Link to="/signup">
                                            <Button className="w-full text-xl font-bold font-philosopher">
                                                Sign up Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2025 GradSpace (College of Engineering Adoor).
                            All rights reserved.
                        </p>
                        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                            <button
                                className="text-sm hover:underline underline-offset-4"
                                onClick={() => setShowTerms(true)}
                            >
                                Terms of Service
                            </button>
                            <Link
                                className="font-bold text-sm hover:underline underline-offset-4"
                                to="/devinfo"
                            >
                                Dev-info
                            </Link>
                        </nav>
                    </footer>
                    {showTerms && (
                        <TermsOfService onClose={() => setShowTerms(false)} />
                    )}
                </div>
            </TracingBeam>
        </Suspense>
    )
}
