// version 1 landing page - general alumni student interaction page.

// import { motion, useScroll, useTransform } from "framer-motion"
// import { lazy, Suspense, useState } from "react"
// import { Link } from "react-router-dom"
// import { Link as ScrollLink } from "react-scroll"

// import alumniSvg from "@/assets/alumni2.png"
// import alumniSvg2 from "@/assets/alumni3.png"
// import collegeSvg from "@/assets/college.svg"
// import IconContact from "@/assets/icons/IconContact"
// import IconHome from "@/assets/icons/IconHome"
// import IconInfoCircle from "@/assets/icons/IconInfoCircle"
// import IconStar from "@/assets/icons/IconStar"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

// const AnimatedShinyText = lazy(
//     () => import("@/components/ui/animated-shiny-text")
// )
// const FloatingNav = lazy(() => import("@/components/ui/floating-navbar"))
// const ShinyButton = lazy(() => import("@/components/ui/shiny-button"))
// const StickyScroll = lazy(() => import("@/components/ui/sticky-scroll-reveal"))
// const TracingBeam = lazy(() => import("@/components/ui/tracing-beam"))
// const DotBackground = lazy(() => import("@/components/DotBackground"))
// const TermsOfService = lazy(() => import("../TermsOfService"))
// const Features = lazy(() => import("./Features"))
// // const Testimonials = lazy(() => import("./Testimonials"))
// const CampusGallery = lazy(() => import("./CampusGallary"))
// const OptimizedImage = lazy(() => import("./OptimizedImage"))

// const navItems = [
//     {
//         name: "Home",
//         link: "#home",
//         icon: <IconHome />,
//     },
//     {
//         name: "About",
//         link: "#about",
//         icon: <IconInfoCircle />,
//     },
//     {
//         name: "Features",
//         link: "#features",
//         icon: <IconStar />,
//     },
//     {
//         name: "campus",
//         link: "#gallery",
//         icon: <IconContact />,
//     },
// ]

// export default function Home() {
//     const [showTerms, setShowTerms] = useState(false)
//     const { scrollYProgress } = useScroll()
//     const opacity = useTransform(scrollYProgress, [0, 0.2], [-0.5, 1])

//     return (
//         <Suspense fallback={<div></div>}>
//             <TracingBeam>
//                 <div className="flex flex-col min-h-screen">
//                     <DotBackground />
//                     <FloatingNav navItems={navItems} />
//                     <main className="flex-1">
//                         {/* Hero Section */}
//                         <section
//                             className="flex items-center justify-center md:py-3 py-20 min-h-screen"
//                             id="home"
//                         >
//                             <OptimizedImage
//                                 src={alumniSvg}
//                                 alt="Alumni"
//                                 className="hidden dark:sm:block h-[500px] mb-20"
//                             />
//                             <OptimizedImage
//                                 src={alumniSvg2}
//                                 alt="Alumni 2"
//                                 className="hidden dark:hidden sm:block h-[500px] mb-20"
//                             />
//                             <motion.div style={{ opacity }}>
//                                 <OptimizedImage
//                                     src={collegeSvg}
//                                     alt="College"
//                                     className="hidden sm:block h-[500px] -z-10 top-0 fixed"
//                                 />
//                             </motion.div>
//                             <div className="container px-4 md:px-6">
//                                 <motion.div
//                                     initial={{ opacity: 0, y: 50 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     transition={{ duration: 0.8, delay: 0.2 }}
//                                     className="flex flex-col items-center space-y-4 text-center text-[#000000] dark:text-[#FFFEFE]"
//                                 >
//                                     <h1 className="mb-6 text-4xl font-bold font-philosopher tracking-tighter sm:text-5xl md:text-6xl relative">
//                                         <div>
//                                             <span className="inline-block px-4 transform skew-y-2 rounded-bl-2xl bg-black/50 dark:bg-white/50 dark:text-black text-white/90">
//                                                 <span className="transform -skew-y-2 inline-block">
//                                                     Simplify
//                                                 </span>
//                                             </span>{" "}
//                                             Your Alumni
//                                         </div>
//                                         <>
//                                             Network,{" "}
//                                             <span className="inline-block px-4 transform -skew-y-2 rounded-br-2xl bg-black/50 dark:bg-white/50 dark:text-black text-white/90">
//                                                 <span className="transform skew-y-2 inline-block">
//                                                     Amplify
//                                                 </span>
//                                             </span>
//                                             <br />
//                                             Connections
//                                         </>
//                                     </h1>
//                                     <motion.div
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         transition={{
//                                             duration: 0.8,
//                                             delay: 0.4,
//                                         }}
//                                         className="max-w-[700px] mx-auto px-4"
//                                     >
//                                         <p className="text-base sm:text-lg md:text-xl font-philosopher text-gray-600 dark:text-white text-center">
//                                             {" "}
//                                             Why bridge the gap yourself when{" "}
//                                             <span
//                                                 className={cn(
//                                                     "inline-block px-4 transform -skew-y-2 bg-violet-200 dark:bg-black/70 rounded-md font-bold font-philosopher dark:text-white text-black"
//                                                 )}
//                                             >
//                                                 {" "}
//                                                 <span className="transform p-1 skew-y-2 inline-block">
//                                                     gradSpace
//                                                 </span>{" "}
//                                             </span>{" "}
//                                             does it for you? Explore{" "}
//                                             <span className="font-medium">
//                                                 job opportunities
//                                             </span>
//                                             , build{" "}
//                                             <span className="font-medium">
//                                                 peer connections
//                                             </span>
//                                             , and unlock meaningful
//                                             collaborations – all through the
//                                             power of{" "}
//                                             <AnimatedShinyText>
//                                                 student-alumni synergy
//                                             </AnimatedShinyText>
//                                             . <br />
//                                         </p>
//                                     </motion.div>
//                                     <motion.div
//                                         initial={{ opacity: 0, y: 20 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         transition={{
//                                             duration: 0.8,
//                                             delay: 0.6,
//                                         }}
//                                         className="gap-5 flex"
//                                     >
//                                         <Link to="/signup">
//                                             <Button className="font-philosopher font-bold">
//                                                 {" "}
//                                                 Join the Network
//                                             </Button>
//                                         </Link>
//                                         <ScrollLink
//                                             to="about"
//                                             spy={true}
//                                             smooth={true}
//                                             duration={500}
//                                             className={cn(
//                                                 "relative dark:text-neutral-50 items-center cursor-pointer flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
//                                             )}
//                                         >
//                                             <ShinyButton className="font-philosopher font-bold">
//                                                 See How It Works
//                                             </ShinyButton>
//                                         </ScrollLink>
//                                     </motion.div>
//                                     <span className=" inline-block text-center w-full philosopher text-gray-900  dark:text-white font-philosopher ">
//                                         College of Engineering Adoor
//                                     </span>
//                                 </motion.div>
//                             </div>
//                         </section>

//                         {/* About Section */}
//                         <section id="about" className="py-20">
//                             <div className="container mx-auto px-4">
//                                 <StickyScroll
//                                     content={[
//                                         {
//                                             title: "About GradSpace",
//                                             description:
//                                                 "In a world where social media tells the story of your life—whether through who you follow or the content you consume—there's a growing need for spaces that foster meaningful, purposeful connections. Gradspace was born from this realization.",
//                                         },
//                                         {
//                                             title: "Bridging the Gap",
//                                             description:
//                                                 "It's not just about scrolling through feeds; it's about actively shaping your journey. Gradspace is designed to connect students and alumni in a meaningful way, helping you bridge the gap between education and professional growth.",
//                                         },
//                                         {
//                                             title: "Empowering Growth",
//                                             description:
//                                                 "Whether you're a student looking for guidance, or an alum eager to give back, this platform creates a space where knowledge, experience, and opportunities can be shared without barriers.",
//                                         },
//                                         {
//                                             title: "Taking Control",
//                                             description:
//                                                 "With Gradspace, the future of your career is not left to chance. It's about empowering you, as a student or graduate, to make connections that can change your life, and in turn, contribute to the success of others.",
//                                         },
//                                     ]}
//                                 />
//                             </div>
//                         </section>

//                         {/* Features Section */}
//                         <Features />
//                         {/* Campus Gallery Section */}
//                         <section id="gallery">
//                             <CampusGallery />
//                         </section>

//                         <section
//                             id="contact"
//                             className="w-full flex justify-center py-12 md:py-24 lg:py-32"
//                         >
//                             <div className="container px-4 md:px-6">
//                                 <div className="flex flex-col items-center space-y-4 text-center">
//                                     <div className="space-y-2">
//                                         <h2 className="text-3xl font-philosopher font-bold tracking-tighter sm:text-5xl">
//                                             Join GradSpace Today
//                                         </h2>
//                                         <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
//                                             Start building your professional
//                                             network and unlock new
//                                             opportunities. Sign up now to
//                                             connect with alumni and fellow
//                                             graduates.
//                                         </p>
//                                     </div>
//                                     <div className="w-full max-w-sm space-y-2">
//                                         <Link to="/signup">
//                                             <Button className="w-full text-xl font-bold font-philosopher">
//                                                 Sign up Now
//                                             </Button>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>
//                     </main>
//                     <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                             © 2025 GradSpace (College of Engineering Adoor).
//                             All rights reserved.
//                         </p>
//                         <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//                             <button
//                                 className="text-sm hover:underline underline-offset-4"
//                                 onClick={() => setShowTerms(true)}
//                             >
//                                 Terms of Service
//                             </button>
//                             <Link
//                                 className="font-bold text-sm hover:underline underline-offset-4"
//                                 to="/devinfo"
//                             >
//                                 Dev-info
//                             </Link>
//                         </nav>
//                     </footer>
//                     {showTerms && (
//                         <TermsOfService onClose={() => setShowTerms(false)} />
//                     )}
//                 </div>
//             </TracingBeam>
//         </Suspense>
//     )
// }

// version 2 landing page - specifically for CEA.
import { motion } from "framer-motion"
import { lazy, Suspense, useState } from "react"
import { Link } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"

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
const CampusGallery = lazy(() => import("./CampusGallary"))

import headerImg1 from "@/assets/cea/building.png"
import headerImg2 from "@/assets/cea/court.png"
import headerImg3 from "@/assets/cea/mech_block.png"

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
        name: "Campus",
        link: "#gallery",
        icon: <IconContact />,
    },
]

// Campus images component
const CampusImageCarousel = ({ fullScreenMobile = false }) => {
    const campusImages = [
        {
            src: headerImg1, // Update with correct path to Image 1
            alt: "CEA Main Academic Block",
        },
        {
            src: headerImg2, // Update with correct path to Image 2
            alt: "CEA Department Block",
        },
        {
            src: headerImg3, // Update with correct path to Image 3
            alt: "CEA Central Courtyard",
        },
    ]

    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    setTimeout(() => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === campusImages.length - 1 ? 0 : prevIndex + 1
        )
    }, 7000)

    return (
        <div
            className={`relative ${fullScreenMobile ? "h-full" : "h-[300px] md:h-[500px]"} w-full`}
        >
            {campusImages.map((image, index) => (
                <motion.img
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    className={`absolute top-0 left-0 h-full w-full object-cover
                    ${fullScreenMobile ? "rounded-none" : "rounded-lg shadow-xl"}`}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: currentImageIndex === index ? 1 : 0,
                        scale: currentImageIndex === index ? 1 : 1,
                    }}
                    transition={{ duration: 1 }}
                />
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {campusImages.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            currentImageIndex === index
                                ? "bg-primary"
                                : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}

export default function Home() {
    const [showTerms, setShowTerms] = useState(false)
    // const { scrollYProgress } = useScroll()
    // const opacity = useTransform(scrollYProgress, [0, 0.2], [-0.5, 1])

    return (
        <Suspense fallback={<div></div>}>
            <TracingBeam>
                <div className="flex flex-col min-h-screen">
                    <DotBackground />
                    <FloatingNav navItems={navItems} />
                    <main className="flex-1">
                        {/* Hero Section */}
                        <section
                            className="relative flex flex-col items-center justify-center min-h-[100vh]"
                            id="home"
                        >
                            {/* Full-screen background image for mobile */}
                            <div className="absolute inset-0 w-full h-full md:hidden">
                                <CampusImageCarousel fullScreenMobile={true} />
                                {/* Overlay for better text readability */}
                                <div className="absolute inset-0 bg-black/40"></div>
                            </div>

                            <div className="container relative z-10 px-4 md:px-6 py-12 md:py-20">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.2,
                                        }}
                                        className="flex flex-col space-y-4 text-center md:text-left md:text-[#000000] text-white"
                                    >
                                        <h1 className="mb-6 text-3xl font-bold font-philosopher tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl relative">
                                            <div>
                                                <span className="inline-block px-4 transform skew-y-2 rounded-bl-2xl bg-black/50 dark:bg-white/50 dark:text-black text-white/90">
                                                    <span className="transform -skew-y-2 inline-block">
                                                        Reconnect
                                                    </span>
                                                </span>{" "}
                                                <span className="text-black dark:text-white">
                                                    With Your
                                                </span>
                                            </div>
                                            <>
                                                <span className="text-black dark:text-white">
                                                    CEA Alumni{" "}
                                                </span>
                                                <span className="inline-block px-4 transform -skew-y-2 rounded-br-2xl bg-black/50 dark:bg-white/50 dark:text-black text-white/90">
                                                    <span className="transform skew-y-2 inline-block">
                                                        Network
                                                    </span>
                                                </span>
                                            </>
                                        </h1>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.4,
                                            }}
                                        >
                                            <p className="text-base sm:text-lg md:text-xl font-philosopher md:text-gray-600 text-white dark:text-white">
                                                Connect with College of
                                                Engineering Adoor alumni through{" "}
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
                                                – your gateway to{" "}
                                                <span className="font-medium">
                                                    professional opportunities
                                                </span>
                                                , industry{" "}
                                                <span className="font-medium">
                                                    mentorship
                                                </span>
                                                , and the CEA{" "}
                                                <AnimatedShinyText>
                                                    global community
                                                </AnimatedShinyText>
                                                .
                                            </p>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.6,
                                            }}
                                            className="flex flex-col sm:flex-row gap-4 pt-6 justify-center md:justify-start"
                                        >
                                            <Link
                                                to="/signup"
                                                className="w-full sm:w-auto"
                                            >
                                                <Button className="w-full sm:w-auto font-philosopher font-bold">
                                                    Join the CEA Network
                                                </Button>
                                            </Link>
                                            <ScrollLink
                                                to="about"
                                                spy={true}
                                                smooth={true}
                                                duration={500}
                                                className="w-full sm:w-auto"
                                            >
                                                <ShinyButton className="w-full sm:w-auto font-philosopher font-bold">
                                                    Explore CEA
                                                </ShinyButton>
                                            </ScrollLink>
                                        </motion.div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.4,
                                        }}
                                        className="mt-8 md:mt-0 hidden md:block"
                                    >
                                        <CampusImageCarousel />
                                    </motion.div>
                                </div>
                            </div>
                        </section>

                        {/* About Section */}
                        <section id="about" className="py-16 md:py-20">
                            <div className="container mx-auto px-4">
                                <StickyScroll
                                    content={[
                                        {
                                            title: "CEA Alumni Network",
                                            description:
                                                "Founded in 1995, College of Engineering Adoor has produced thousands of successful engineers who are making an impact across the globe. Our alumni network is a powerful resource waiting to be tapped.",
                                        },
                                        {
                                            title: "Connecting Generations of CEA",
                                            description:
                                                "GradSpace bridges the gap between current students and alumni from all batches of CEA. From the first graduating class to recent graduates, connect with peers who understand your journey.",
                                        },
                                        {
                                            title: "Empowering CEA Students",
                                            description:
                                                "As a current student, gain insights from alumni who've walked the same corridors, faced the same challenges, and succeeded in diverse fields. Get guidance on internships, projects, and career paths specific to your department.",
                                        },
                                        {
                                            title: "Give Back to Your Alma Mater",
                                            description:
                                                "For alumni, GradSpace offers a meaningful way to reconnect with CEA, mentor the next generation, share job opportunities, and collaborate on initiatives that benefit the entire CEA community.",
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
                                        <h2 className="text-3xl font-philosopher font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                            Join the CEA Alumni Network Today
                                        </h2>
                                        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                            Start building your professional
                                            network with fellow CEA graduates
                                            and unlock new opportunities. Sign
                                            up now to connect with alumni from
                                            all departments and batches.
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
                        <p className="text-sm text-center sm:text-left text-gray-500 dark:text-gray-400">
                            © 2025 GradSpace (College of Engineering Adoor).
                            All rights reserved.
                        </p>
                        <nav className="sm:ml-auto flex gap-4 sm:gap-6 justify-center sm:justify-end">
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
