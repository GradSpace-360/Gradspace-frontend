import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Education } from "@/types/user/Profile"

interface EducationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    education: Education
    setEducation: (education: Education) => void
    onSave: () => void
}

export const EducationModal = ({
    open,
    onOpenChange,
    education,
    setEducation,
    onSave,
}: EducationModalProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Education</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Institution Name</Label>
                    <Input
                        value={education.institutionName}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                institutionName: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Course</Label>
                    <Input
                        value={education.course}
                        onChange={(e) =>
                            setEducation({
                                ...education,
                                course: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                            type="date"
                            value={education.startDate?.split("T")[0] || ""}
                            onChange={(e) =>
                                setEducation({
                                    ...education,
                                    startDate: `${e.target.value}T00:00:00+05:30`,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                            type="date"
                            value={education.endDate?.split("T")[0] || ""}
                            onChange={(e) =>
                                setEducation({
                                    ...education,
                                    endDate: `${e.target.value}T00:00:00+05:30`,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Grade</Label>
                        <Input
                            value={education.grade}
                            onChange={(e) =>
                                setEducation({
                                    ...education,
                                    grade: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                            value={education.location}
                            onChange={(e) =>
                                setEducation({
                                    ...education,
                                    location: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={() => onOpenChange(false)} variant="outline">
                    Cancel
                </Button>
                <Button onClick={onSave}>Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)
