import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react"
import { useState } from "react"

// Import all images properly
import building from "@/assets/cea/building.png"
import classroom from "@/assets/cea/classroom.png"
import court from "@/assets/cea/court.png"
import entrance from "@/assets/cea/entrance.png"
import sattva_faculty1 from "@/assets/cea/faculty.jpg"
import hostel from "@/assets/cea/hostel.png"
import mech_block from "@/assets/cea/mech_block.png"
import parking from "@/assets/cea/parking.png"
import sattva_principal from "@/assets/cea/principal.jpg"
import robot from "@/assets/cea/robot.png"
import sattva_dance from "@/assets/cea/sattva_dance.jpg"
import keyboard from "@/assets/cea/sattva_keyboard.jpg"
import students from "@/assets/cea/students.png"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Image data with categories
const galleryImages = [
    {
        src: building,
        alt: "Main building exterior",
        category: "campus",
        description: "Modern architecture of the main academic building",
    },
    {
        src: classroom,
        alt: "Classroom with wooden benches",
        category: "academics",
        description: "Well-equipped classrooms facilitate focused learning",
    },
    {
        src: entrance,
        alt: "College entrance gate",
        category: "campus",
        description: "The welcoming entrance to College of Engineering, Adoor",
    },
    {
        src: parking,
        alt: "Campus parking area with greenery",
        category: "campus",
        description: "Spacious parking facility surrounded by lush greenery",
    },
    {
        src: robot,
        alt: "Engineering robot display",
        category: "campus",
        description:
            "Innovative student engineering projects showcase creativity",
    },
    {
        src: students,
        alt: "Students at college entrance",
        category: "campus",
        description: "College of Engineering entrance with students",
    },
    {
        src: mech_block,
        alt: "Mechanical engineering block",
        category: "campus",
        description: "Mechanical engineering block with advanced labs",
    },
    {
        src: hostel,
        alt: "Student hostel building",
        category: "events",
        description: "sports and cultural events",
    },
    {
        src: keyboard,
        alt: "Musician playing Yamaha keyboard during event",
        category: "events",
        description:
            "Live music performance on keyboard during the SATTVA'25 cultural night ",
    },
    {
        src: sattva_faculty1, // Person with microphone reading (faculty)
        alt: "Faculty member singing on stage with microphone",
        category: "events",
        description:
            "College faculty member showcasing musical talent during SATTVA'25 cultural program",
    },
    {
        src: sattva_dance, // Two dancers in yellow skirts
        alt: "Two dancers in matching outfits performing on stage",
        category: "events",
        description:
            "Dance duo performing traditional dance forms at SATTVA'25 cultural night",
    },
    {
        src: court,
        alt: "Sports court with students playing",
        category: "events",
        description: "Well-maintained sports facilities for student recreation",
    },
    {
        src: sattva_principal, // Speaker with microphone (principal)
        alt: "College principal singing on stage with microphone",
        category: "events",
        description:
            "College principal showcasing musical talent during SATTVA'25 cultural program",
    },
]

// Define available categories
const categories = ["all", "academics", "campus", "events"]

export default function CampusGallery() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)
    const [category, setCategory] = useState("all")
    const [isLoading, setIsLoading] = useState(false)
    for (const image of galleryImages) {
        console.log(image.src)
    }

    // Filter images based on selected category
    const filteredImages =
        category === "all"
            ? galleryImages
            : galleryImages.filter((img) => img.category === category)

    const openLightbox = (index: number) => {
        setSelectedImage(index)
        document.body.style.overflow = "hidden"
    }

    const closeLightbox = () => {
        setSelectedImage(null)
        document.body.style.overflow = "auto"
    }

    const navigateImage = (direction: "next" | "prev") => {
        if (selectedImage === null) return

        if (direction === "next") {
            setSelectedImage((selectedImage + 1) % filteredImages.length)
        } else {
            setSelectedImage(
                (selectedImage - 1 + filteredImages.length) %
                    filteredImages.length
            )
        }
    }

    const handleCategoryChange = (value: string) => {
        // Add a loading state for smoother transitions
        setIsLoading(true)
        setCategory(value)
        setTimeout(() => setIsLoading(false), 300)
    }

    // All images are now imported, so we don't need the helper function anymore

    return (
        <section id="campus-gallery" className="w-full py-20 ">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold font-philosopher tracking-tighter sm:text-5xl">
                        <span className="inline-block px-4 transform -skew-y-2 bg-violet-200 dark:bg-[#080909]">
                            <span className="transform skew-y-2 inline-block">
                                Campus Gallery
                            </span>
                        </span>
                    </h2>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore the vibrant campus life and state-of-the-art
                        facilities at College of Engineering, Adoor
                    </p>

                    {/* Category Filter */}
                    <div className="mt-8 flex justify-center ">
                        <Tabs
                            defaultValue="all"
                            value={category}
                            onValueChange={handleCategoryChange}
                            className="w-full max-w-md"
                        >
                            <TabsList className="grid grid-cols-4     h-auto">
                                {categories.map((cat) => (
                                    <TabsTrigger
                                        key={cat}
                                        value={cat}
                                        className="capitalize py-2 px-1 text-xs sm:text-sm flex items-center gap-1"
                                    >
                                        <ImageIcon className="h-3 w-3" />
                                        {cat}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>
                </motion.div>

                {/* Masonry Gallery Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={category}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",
                            isLoading ? "opacity-50" : "opacity-100"
                        )}
                    >
                        {filteredImages.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                whileHover={{ scale: 1.02 }}
                                className={cn(
                                    "overflow-hidden rounded-lg cursor-pointer bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300",
                                    // Add variable heights for some cards to create a more dynamic masonry effect
                                    index % 3 === 0 ? "sm:row-span-2" : "",
                                    index % 5 === 0 ? "lg:col-span-2" : ""
                                )}
                                onClick={() => openLightbox(index)}
                            >
                                <Card className="border-0 h-full">
                                    <CardContent className="p-0 h-full relative group">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            style={{
                                                aspectRatio:
                                                    index % 3 === 0
                                                        ? "3/4"
                                                        : "16/9",
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <Badge
                                                variant="secondary"
                                                className="self-start mb-2"
                                            >
                                                {image.category}
                                            </Badge>
                                            <p className="text-white text-sm">
                                                {image.description}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty state when no images match filter */}
                {filteredImages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                        <ImageIcon className="h-16 w-16 mb-4 opacity-40" />
                        <p>No images found for this category</p>
                        <Button
                            variant="link"
                            onClick={() => setCategory("all")}
                            className="mt-2"
                        >
                            View all images
                        </Button>
                    </div>
                )}

                {/* Lightbox */}
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
                        onClick={closeLightbox}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                closeLightbox()
                            }}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigateImage("prev")
                            }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <div className="flex flex-col items-center">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0.5, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                src={filteredImages[selectedImage]?.src}
                                alt={filteredImages[selectedImage]?.alt}
                                className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-black/60 backdrop-blur-sm rounded-lg px-6 py-3 mt-4 text-center"
                            >
                                <Badge variant="secondary" className="mb-2">
                                    {filteredImages[selectedImage]?.category}
                                </Badge>
                                <p className="text-white text-sm md:text-base">
                                    {filteredImages[selectedImage]?.description}
                                </p>
                            </motion.div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigateImage("next")
                            }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
                            <p className="text-white text-sm">
                                {selectedImage + 1} / {filteredImages.length}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    )
}
