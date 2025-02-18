import { useState } from "react"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Experience } from "@/types/user/Profile"

import { ExperienceModal } from "./ExperienceModal"

interface ExperienceSectionProps {
    experiences: Experience[] | undefined
    handleExperienceChange: (
        index: number,
        field: keyof Experience,
        value: string
    ) => void
    removeExperience: (index: number) => void
    onAddExperience: (experience: Experience) => void
}

export const ExperienceSection = ({
    experiences,
    handleExperienceChange,
    removeExperience,
    onAddExperience,
}: ExperienceSectionProps) => {
    const [showExperienceModal, setShowExperienceModal] = useState(false)
    const [newExperience, setNewExperience] = useState<Experience>({
        companyName: "",
        position: "",
        startDate: "",
        endDate: "",
        jobType: "",
        location: "",
        locationType: "",
    })

    const handleAdd = () => {
        onAddExperience(newExperience)
        setNewExperience({
            companyName: "",
            position: "",
            startDate: "",
            endDate: "",
            jobType: "",
            location: "",
            locationType: "",
        })
        setShowExperienceModal(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-lg">Experience</Label>
                <Button
                    onClick={() => setShowExperienceModal(true)}
                    variant="secondary"
                >
                    Add Experience
                </Button>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
                {experiences?.map((exp, index) => (
                    <AccordionItem key={index} value={`experience-${index}`}>
                        <AccordionTrigger className="px-4 py-2 hover:no-underline">
                            <div className="flex flex-col items-start">
                                <span className="font-semibold">
                                    {exp.companyName || "New Experience"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {exp.position}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Company Name</Label>
                                <Input
                                    value={exp.companyName}
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "companyName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Position</Label>
                                <Input
                                    value={exp.position}
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "position",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={
                                            exp.startDate?.split("T")[0] || ""
                                        }
                                        onChange={(e) =>
                                            handleExperienceChange(
                                                index,
                                                "startDate",
                                                `${e.target.value}T00:00:00+05:30`
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={exp.endDate?.split("T")[0] || ""}
                                        onChange={(e) =>
                                            handleExperienceChange(
                                                index,
                                                "endDate",
                                                `${e.target.value}T00:00:00+05:30`
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Job Type</Label>
                                    <Input
                                        value={exp.jobType}
                                        onChange={(e) =>
                                            handleExperienceChange(
                                                index,
                                                "jobType",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location Type</Label>
                                    <Input
                                        value={exp.locationType}
                                        onChange={(e) =>
                                            handleExperienceChange(
                                                index,
                                                "locationType",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={exp.location}
                                    onChange={(e) =>
                                        handleExperienceChange(
                                            index,
                                            "location",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => removeExperience(index)}
                                    variant="destructive"
                                    size="sm"
                                >
                                    Remove
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <ExperienceModal
                open={showExperienceModal}
                onOpenChange={setShowExperienceModal}
                experience={newExperience}
                setExperience={setNewExperience}
                onSave={handleAdd}
            />
        </div>
    )
}
