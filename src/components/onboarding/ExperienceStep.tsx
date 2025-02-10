import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useOnboardingStore } from "@/store/onboard"
import { Experience } from "@/types/onboard"

export function ExperienceStep() {
    const { formData, setFormData, setStep } = useOnboardingStore()
    const [experiences, setExperiences] = useState<Experience[]>(
        formData.experience || []
    )
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Experience>()
    const [isPresent, setIsPresent] = useState(false)
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)

    const onSubmit = (data: Experience) => {
        if (!startDate) {
            console.error("Start date is required.")
            return
        }
        if (!isPresent && !endDate) {
            console.error("End date is required unless 'Present' is checked.")
            return
        }

        const newExperience: Experience = {
            ...data,
            startDate: startDate,
            endDate: isPresent ? "Present" : endDate!,
        }
        console.log("new experience : ", newExperience)
        const updatedExperiences = [...experiences, newExperience]
        setExperiences(updatedExperiences)
        setFormData({ experience: updatedExperiences })
        reset()
        setIsPresent(false)
        setStartDate(undefined)
        setEndDate(undefined)
        console.log("form stored experiences : ", formData.experience)
    }

    const removeExperience = (index: number) => {
        const updatedExperiences = experiences.filter((_, i) => i !== index)
        setExperiences(updatedExperiences)
        setFormData({ experience: updatedExperiences })
    }

    const handleNext = () => {
        setFormData({ experience: experiences })
        setStep(5)
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
                    Work Experience
                </h2>
                <p className="text-muted-foreground">
                    Add your work experience (optional)
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Experience</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="companyName"
                                    className="block text-sm font-medium"
                                >
                                    Company Name
                                </label>
                                <Input
                                    id="companyName"
                                    {...register("companyName", {
                                        required: "Company name is required",
                                    })}
                                />
                                {errors.companyName && (
                                    <p className="text-sm text-red-500">
                                        {errors.companyName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="position"
                                    className="block text-sm font-medium"
                                >
                                    Position
                                </label>
                                <Input
                                    id="position"
                                    {...register("position", {
                                        required: "Position is required",
                                    })}
                                />
                                {errors.position && (
                                    <p className="text-sm text-red-500">
                                        {errors.position.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Date Picker with Calendar */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="startDate"
                                    className="block text-sm font-medium"
                                >
                                    Start Date
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !startDate &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? (
                                                format(startDate, "PPP")
                                            ) : (
                                                <span>Pick a start date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="center"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) =>
                                                setStartDate(date)
                                            }
                                            autoFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* End Date Picker with Calendar and Present Checkbox */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="endDate"
                                    className="block text-sm font-medium"
                                >
                                    End Date
                                </label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !endDate &&
                                                    !isPresent &&
                                                    "text-muted-foreground"
                                            )}
                                            disabled={isPresent}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? (
                                                format(endDate, "PPP")
                                            ) : (
                                                <span>Pick an end date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="center"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) =>
                                                setEndDate(date)
                                            }
                                            autoFocus
                                            disabled={isPresent}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <div className="flex items-center  space-x-2">
                                    <Checkbox
                                        id="present"
                                        checked={isPresent}
                                        onCheckedChange={(checked) =>
                                            setIsPresent(checked === true)
                                        }
                                    />
                                    <label
                                        htmlFor="present"
                                        className="text-sm font-medium"
                                    >
                                        Present
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="jobType"
                                    className="block text-sm font-medium"
                                >
                                    Job Type
                                </label>
                                <Controller
                                    name="jobType"
                                    control={control}
                                    rules={{ required: "Job type is required" }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select job type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Full-time">
                                                    Full-time
                                                </SelectItem>
                                                <SelectItem value="Part-time">
                                                    Part-time
                                                </SelectItem>
                                                <SelectItem value="Internship">
                                                    Internship
                                                </SelectItem>
                                                <SelectItem value="Freelance">
                                                    Freelance
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="locationType"
                                    className="block text-sm font-medium"
                                >
                                    Location Type
                                </label>
                                <Controller
                                    name="locationType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select location type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Remote">
                                                    Remote
                                                </SelectItem>
                                                <SelectItem value="Onsite">
                                                    Onsite
                                                </SelectItem>
                                                <SelectItem value="Hybrid">
                                                    Hybrid
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
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
                                {...register("location", {
                                    required: "Location is required",
                                })}
                            />
                        </div>

                        <Button type="submit">Add Experience</Button>
                    </form>
                </CardContent>
            </Card>

            {experiences.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Experiences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible>
                            {experiences.map((exp, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                >
                                    <AccordionTrigger>
                                        <div className="flex items-center justify-between w-full">
                                            <h4 className="font-bold">
                                                {exp.position} at{" "}
                                                {exp.companyName}
                                            </h4>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-sm text-muted-foreground">
                                            {exp.startDate instanceof Date
                                                ? format(exp.startDate, "PPP")
                                                : exp.startDate}{" "}
                                            -{" "}
                                            {exp.endDate instanceof Date
                                                ? format(exp.endDate, "PPP")
                                                : exp.endDate}
                                        </p>
                                        <p>
                                            {exp.jobType} | {exp.location} (
                                            {exp.locationType})
                                        </p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                removeExperience(index)
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
                <Button variant="outline" onClick={() => setStep(3)}>
                    Previous
                </Button>
                <Button onClick={handleNext}>Next Step</Button>
            </div>
        </motion.div>
    )
}
