// components/SettingsPreview/EducationSection.tsx
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
import { Education } from "@/types/user/Profile"

import { EducationModal } from "./EducationModal"

interface EducationSectionProps {
    educations: Education[] | undefined
    handleEducationChange: (
        index: number,
        field: keyof Education,
        value: string
    ) => void
    removeEducation: (index: number) => void
    onAddEducation: (education: Education) => void
}

export const EducationSection = ({
    educations,
    handleEducationChange,
    removeEducation,
    onAddEducation,
}: EducationSectionProps) => {
    const [showEducationModal, setShowEducationModal] = useState(false)
    const [newEducation, setNewEducation] = useState<Education>({
        institutionName: "",
        course: "",
        startDate: "",
        endDate: "",
        grade: "",
        location: "",
    })

    const handleAdd = () => {
        onAddEducation(newEducation)
        setNewEducation({
            institutionName: "",
            course: "",
            startDate: "",
            endDate: "",
            grade: "",
            location: "",
        })
        setShowEducationModal(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-lg">Education</Label>
                <Button
                    onClick={() => setShowEducationModal(true)}
                    variant="secondary"
                >
                    Add Education
                </Button>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
                {educations?.map((edu, index) => (
                    <AccordionItem key={index} value={`education-${index}`}>
                        <AccordionTrigger className="px-4 py-2 hover:no-underline">
                            <div className="flex flex-col items-start">
                                <span className="font-semibold">
                                    {edu.institutionName || "New Education"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {edu.course}
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-4">
                            <div className="space-y-2">
                                <Label>Institution Name</Label>
                                <Input
                                    value={edu.institutionName}
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            "institutionName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Course</Label>
                                <Input
                                    value={edu.course}
                                    onChange={(e) =>
                                        handleEducationChange(
                                            index,
                                            "course",
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
                                            edu.startDate?.split("T")[0] || ""
                                        }
                                        onChange={(e) =>
                                            handleEducationChange(
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
                                        value={edu.endDate?.split("T")[0] || ""}
                                        onChange={(e) =>
                                            handleEducationChange(
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
                                    <Label>Grade</Label>
                                    <Input
                                        value={edu.grade}
                                        onChange={(e) =>
                                            handleEducationChange(
                                                index,
                                                "grade",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        value={edu.location}
                                        onChange={(e) =>
                                            handleEducationChange(
                                                index,
                                                "location",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={() => removeEducation(index)}
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

            <EducationModal
                open={showEducationModal}
                onOpenChange={setShowEducationModal}
                education={newEducation}
                setEducation={setNewEducation}
                onSave={handleAdd}
            />
        </div>
    )
}
