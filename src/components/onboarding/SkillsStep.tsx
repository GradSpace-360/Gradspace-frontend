/**
 * SkillsStep Component
 *
 * Manages the skills and interests selection step in the onboarding process.
 * Allows users to select predefined skills and interests or add custom ones.
 * Ensures users select at least 3 skills and 3 interests before proceeding.
 * Utilizes Framer Motion for animations and React Hook Form for form handling.
 */

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useOnboardingStore } from "@/store/onboard"

const PREDEFINED_SKILLS = [
    "Communication",
    "Problem Solving",
    "Teamwork",
    "Time Management",
    "Programming",
    "Python",
    "Web Development",
    "Data Structures & Algorithms",
    "Machine Learning",
    "CAD Design (AutoCAD, SolidWorks)",
    "Thermodynamics",
    "Robotics",
    "3D Printing",
    "Circuit Design",
    "Embedded Systems",
    "Power Systems",
    "IoT (Internet of Things)",
]

const PREDEFINED_INTERESTS = [
    "Personal Development",
    "Entrepreneurship",
    "Public Speaking",
    "Fitness & Health",
    "Artificial Intelligence",
    "Web Development",
    "Cybersecurity",
    "Cloud Computing",
    "Robotics",
    "Automotive Engineering",
    "Renewable Energy Systems",
    "3D Printing",
    "Embedded Systems",
    "IoT (Internet of Things)",
    "Renewable Energy",
    "Robotics & Automation",
]

export function SkillsStep() {
    const { formData, setFormData, setStep } = useOnboardingStore()
    const [customSkill, setCustomSkill] = useState("")
    const [customInterest, setCustomInterest] = useState("")
    const [selectedSkills, setSelectedSkills] = useState<string[]>(
        formData.skills
    )
    const [selectedInterests, setSelectedInterests] = useState<string[]>(
        formData.interests
    )

    const handleSkillSelect = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        )
    }

    const handleInterestSelect = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        )
    }

    const addCustomSkill = () => {
        if (customSkill && !selectedSkills.includes(customSkill)) {
            setSelectedSkills((prev) => [...prev, customSkill])
            setCustomSkill("")
        }
    }

    const addCustomInterest = () => {
        if (customInterest && !selectedInterests.includes(customInterest)) {
            setSelectedInterests((prev) => [...prev, customInterest])
            setCustomInterest("")
        }
    }

    const handleNext = () => {
        if (selectedSkills.length < 3 || selectedInterests.length < 3) {
            toast.error(
                "Please select at least 3 skills and 3 interests before proceeding."
            )
            return
        }
        setFormData({ skills: selectedSkills, interests: selectedInterests })
        setStep(3)
    }

    const handlePrevious = () => {
        setFormData({ skills: selectedSkills, interests: selectedInterests })
        setStep(1)
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
                    Skills & Interests
                </h2>
                <p className="text-muted-foreground">
                    Select at least 3 skills and interests
                </p>
            </div>

            <Card>
                <CardContent className="mt-5 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PREDEFINED_SKILLS.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant={
                                        selectedSkills.includes(skill)
                                            ? "default"
                                            : "outline"
                                    }
                                    className="cursor-pointer"
                                    onClick={() => handleSkillSelect(skill)}
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Add custom skill"
                            value={customSkill}
                            onChange={(e) => setCustomSkill(e.target.value)}
                        />
                        <Button type="button" onClick={addCustomSkill}>
                            Add
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Selected Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {selectedSkills.map((skill) => (
                                <Badge key={skill} className="gap-1">
                                    {skill}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => handleSkillSelect(skill)}
                                    />
                                </Badge>
                            ))}
                        </div>
                        {selectedSkills.length < 3 && (
                            <p className="text-sm text-red-500">
                                Please select at least 3 skills
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Interests
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PREDEFINED_INTERESTS.map((interest) => (
                                <Badge
                                    key={interest}
                                    variant={
                                        selectedInterests.includes(interest)
                                            ? "default"
                                            : "outline"
                                    }
                                    className="cursor-pointer"
                                    onClick={() =>
                                        handleInterestSelect(interest)
                                    }
                                >
                                    {interest}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Add custom interest"
                            value={customInterest}
                            onChange={(e) => setCustomInterest(e.target.value)}
                        />
                        <Button type="button" onClick={addCustomInterest}>
                            Add
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Selected Interests
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {selectedInterests.map((interest) => (
                                <Badge key={interest} className="gap-1">
                                    {interest}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() =>
                                            handleInterestSelect(interest)
                                        }
                                    />
                                </Badge>
                            ))}
                        </div>
                        {selectedInterests.length < 3 && (
                            <p className="text-sm text-red-500">
                                Please select at least 3 interests
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={handlePrevious}>
                    Previous
                </Button>
                <Button onClick={handleNext}>Next Step</Button>
            </div>
        </motion.div>
    )
}
