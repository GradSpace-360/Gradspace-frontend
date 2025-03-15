import { motion } from "framer-motion"
import { Trash2, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/store/auth"
import { useOnboardingStore } from "@/store/onboard"

interface WelcomeFormData {
    headline: string
    about: string
    location: string
}

export function WelcomeStep() {
    const { formData, setFormData, setStep } = useOnboardingStore()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<WelcomeFormData>({
        defaultValues: {
            headline: formData.headline,
            about: formData.about,
            location: formData.location,
        },
    })

    const { user } = useAuthStore()
    // Use a base64 string for previewing the image
    const [previewImage, setPreviewImage] = useState<string | null>(
        formData.profileImage
            ? URL.createObjectURL(
                  new Blob([new Uint8Array(formData.profileImage)], {
                      type: "image/jpeg",
                  })
              )
            : null
    )

    const fileInputRef = useRef<HTMLInputElement>(null)

    const onSubmit = async (data: WelcomeFormData) => {
        const profileImageFile = fileInputRef.current?.files?.[0]

        if (profileImageFile) {
            const profileImageBinary = await new Promise<ArrayBuffer>(
                (resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        if (reader.result instanceof ArrayBuffer) {
                            resolve(reader.result)
                        } else {
                            reject(
                                new Error(
                                    "Failed to read the image file as binary data."
                                )
                            )
                        }
                    }
                    reader.onerror = () => {
                        reject(new Error("Failed to read the image file."))
                    }
                    reader.readAsArrayBuffer(profileImageFile)
                }
            )

            setFormData({
                ...formData,
                profileImage: profileImageBinary, // Store the binary data
                headline: data.headline,
                about: data.about,
                location: data.location,
            })
        } else {
            setFormData({
                ...formData,
                headline: data.headline,
                about: data.about,
                location: data.location,
                profileImage: formData.profileImage, // Keep the existing binary data
            })
        }

        setStep(2)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Only JPEG or PNG images are allowed.")
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
                setPreviewImage(null)
                return
            }

            if (file.size > 1048576) {
                toast.error("Image size must be less than 1MB.")
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
                setPreviewImage(null)
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result as string) // Set the base64 URL for preview
            }
            reader.readAsDataURL(file) // Read the file as a base64 URL
        } else {
            setPreviewImage(null)
        }
    }

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemoveImage = () => {
        setPreviewImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        setFormData({
            ...formData,
            profileImage: null, // Clear the binary data
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-philosopher font-bold text-primary">
                    Welcome! Let's get started.
                </h2>
                <p className="text-muted-foreground">
                    Tell us a bit about yourself
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-32 h-32">
                                <div
                                    className="w-32 h-32 rounded-full overflow-hidden cursor-pointer group"
                                    onClick={handleImageClick}
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        {previewImage ? (
                                            <Trash2
                                                className="w-8 h-8 text-white cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveImage()
                                                }}
                                            />
                                        ) : (
                                            <Upload className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                ref={fileInputRef}
                            />
                            <p className="text-sm text-muted-foreground">
                                upload profile picture (optional)
                            </p>
                            <p className="font-semibold font-philosopher text-lg">
                                {" "}
                                {user!.full_name}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="headline"
                                className="block text-sm font-medium"
                            >
                                Professional Headline
                            </label>
                            <Input
                                id="headline"
                                placeholder="e.g. Software Engineer"
                                {...register("headline", {
                                    required: "Headline is required",
                                })}
                            />
                            {errors.headline && (
                                <p className="text-sm text-red-500">
                                    {errors.headline.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="about"
                                className="block text-sm font-medium"
                            >
                                About
                            </label>
                            <Textarea
                                id="about"
                                placeholder="Write a short bio..."
                                {...register("about", {
                                    required: "Bio is required",
                                })}
                            />
                            {errors.about && (
                                <p className="text-sm text-red-500">
                                    {errors.about.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="location"
                                className="block text-sm font-medium"
                            >
                                Location
                            </label>
                            <Input
                                id="location"
                                placeholder="e.g. San Francisco, CA"
                                {...register("location", {
                                    required: "Location is required",
                                })}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">
                                    {errors.location.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center">
                    <Button type="submit">Next Step</Button>
                </div>
            </form>
        </motion.div>
    )
}
