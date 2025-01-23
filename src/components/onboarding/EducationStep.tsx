import { motion } from "framer-motion"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useOnboardingStore } from "@/store/onboard"
import { Education } from "@/types/onboard"

export function EducationStep() {
    const { formData, setFormData, setStep } = useOnboardingStore()
    const [educations, setEducations] = useState<Education[]>(
        formData.education || [] // Default to an empty array if formData.education is undefined
    )
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Education>()

    const onSubmit = (data: Education) => {
        const updatedEducations = [...educations, data]
        setEducations(updatedEducations)
        setFormData({ education: updatedEducations })
        reset()
    }

    const removeEducation = (index: number) => {
        const updatedEducations = educations.filter((_, i) => i !== index)
        setEducations(updatedEducations)
        setFormData({ education: updatedEducations })
    }

    const handleNext = () => {
        setFormData({ education: educations })
        setStep(4) // Move to the next step (ExperienceStep)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-philosopher font-bold">
                    Education
                </h2>
                <p className="text-muted-foreground">
                    Add your education details (optional)
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Education</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="institutionName"
                                    className="block text-sm font-medium"
                                >
                                    Institution Name
                                </label>
                                <Input
                                    id="institutionName"
                                    {...register("institutionName", {
                                        required:
                                            "Institution name is required",
                                    })}
                                />
                                {errors.institutionName && (
                                    <p className="text-sm text-red-500">
                                        {errors.institutionName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="course"
                                    className="block text-sm font-medium"
                                >
                                    Course
                                </label>
                                <Input
                                    id="course"
                                    {...register("course", {
                                        required: "Course is required",
                                    })}
                                />
                                {errors.course && (
                                    <p className="text-sm text-red-500">
                                        {errors.course.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="startDate"
                                    className="block text-sm font-medium"
                                >
                                    Start Date
                                </label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    {...register("startDate", {
                                        required: "Start date is required",
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="endDate"
                                    className="block text-sm font-medium"
                                >
                                    End Date
                                </label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    {...register("endDate", {
                                        required: "End date is required",
                                    })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="location"
                                    className="block text-sm font-medium"
                                >
                                    Location
                                </label>
                                <Input
                                    id="location"
                                    {...register("location", {
                                        required: "Location is required",
                                    })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="grade"
                                    className="block text-sm font-medium"
                                >
                                    Grade
                                </label>
                                <Input
                                    id="grade"
                                    {...register("grade", {
                                        required: "Grade is required",
                                    })}
                                />
                            </div>
                        </div>

                        <Button type="submit">Add Education</Button>
                    </form>
                </CardContent>
            </Card>

            {educations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            {educations.map((edu, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                >
                                    <AccordionTrigger>
                                        <div className="flex items-center justify-between w-full">
                                            <h4 className="font-bold">
                                                {edu.course} at{" "}
                                                {edu.institutionName}
                                            </h4>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-muted-foreground">
                                            {edu.startDate} - {edu.endDate}
                                        </p>
                                        <p>{edu.location}</p>
                                        <p>Grade: {edu.grade}</p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                removeEducation(index)
                                            }
                                            className="mt-2"
                                        >
                                            Remove
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                    Previous
                </Button>
                <Button onClick={handleNext}>Next Step</Button>
            </div>
        </motion.div>
    )
}
