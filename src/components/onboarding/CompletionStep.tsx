import { motion } from "framer-motion"
import { FileText, Github, Globe, Instagram, Linkedin } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth"
import { useOnboardingStore } from "@/store/onboard"

export function CompletionStep() {
    const { formData, setStep, submitFormData } = useOnboardingStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { checkAuth } = useAuthStore()

    // Convert binary image data to a URL for display
    const profileImageUrl = formData.profileImage
        ? URL.createObjectURL(
              new Blob([new Uint8Array(formData.profileImage)], {
                  type: "image/jpeg",
              })
          )
        : null

    // Helper to convert date fields into Date object, returns undefined if invalid

    // Update handleSubmit to transform education and experience dates before submission
    const handleSubmit = async () => {
        setIsSubmitting(true)
        console.log("Submitting form data:", formData)
        try {
            await submitFormData()
            await checkAuth()
            navigate("/dashboard")
        } catch (error) {
            console.error("Submission failed:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function to display date in local format
    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return "Present"
        const parsedDate = date instanceof Date ? date : new Date(date)
        return isNaN(parsedDate.getTime())
            ? "Present"
            : parsedDate.toLocaleDateString()
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-philosopher font-bold">
                    Almost Done!
                </h2>
                <p className="text-muted-foreground">
                    Review your profile information and complete the onboarding
                    process
                </p>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden">
                            {profileImageUrl ? (
                                <img
                                    src={profileImageUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>
                        <h3 className="text-2xl font-semibold">
                            {formData.headline}
                        </h3>
                        <p className="text-center text-muted-foreground">
                            {formData.about}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {formData.location}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Interests</h4>
                            <div className="flex flex-wrap gap-2">
                                {formData.interests.map((interest, index) => (
                                    <Badge key={index} variant="secondary">
                                        {interest}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {formData.education.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Education</h4>
                                <div className="space-y-2">
                                    {formData.education.map((edu, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-muted rounded"
                                        >
                                            <p className="font-semibold">
                                                {edu.course} at{" "}
                                                {edu.institutionName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(edu.startDate)} -{" "}
                                                {formatDate(edu.endDate)}
                                            </p>
                                            <p className="text-sm">
                                                {edu.location}
                                            </p>
                                            <p className="text-sm">
                                                Grade: {edu.grade}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.experience.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Experience</h4>
                                <div className="space-y-2">
                                    {formData.experience.map((exp, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-muted rounded"
                                        >
                                            <p className="font-semibold">
                                                {exp.position} at{" "}
                                                {exp.companyName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(exp.startDate)} -{" "}
                                                {formatDate(exp.endDate)}
                                            </p>
                                            <p className="text-sm">
                                                {exp.jobType} | {exp.location} (
                                                {exp.locationType})
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-medium mb-2">Social Links</h4>
                            <div className="flex space-x-4">
                                {formData.socialLinks.github && (
                                    <a
                                        href={formData.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Github className="w-6 h-6" />
                                    </a>
                                )}
                                {formData.socialLinks.instagram && (
                                    <a
                                        href={formData.socialLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Instagram className="w-6 h-6" />
                                    </a>
                                )}
                                {formData.socialLinks.linkedin && (
                                    <a
                                        href={formData.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                                {formData.socialLinks.website && (
                                    <a
                                        href={formData.socialLinks.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Globe className="w-6 h-6" />
                                    </a>
                                )}
                                {formData.socialLinks.resume && (
                                    <a
                                        href={formData.socialLinks.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FileText className="w-6 h-6" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep(5)}>
                    Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Complete Onboarding"}
                </Button>
            </div>
        </motion.div>
    )
}
