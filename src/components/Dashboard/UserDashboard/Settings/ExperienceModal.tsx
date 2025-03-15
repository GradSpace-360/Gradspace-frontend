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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Experience } from "@/types/user/Profile"

interface ExperienceModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    experience: Experience
    setExperience: (experience: Experience) => void
    onSave: () => void
}

export const ExperienceModal = ({
    open,
    onOpenChange,
    experience,
    setExperience,
    onSave,
}: ExperienceModalProps) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Experience</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                        value={experience.companyName}
                        onChange={(e) =>
                            setExperience({
                                ...experience,
                                companyName: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                        value={experience.position}
                        onChange={(e) =>
                            setExperience({
                                ...experience,
                                position: e.target.value,
                            })
                        }
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                            type="date"
                            value={experience.startDate?.split("T")[0] || ""}
                            onChange={(e) =>
                                setExperience({
                                    ...experience,
                                    startDate: `${e.target.value}T00:00:00+05:30`,
                                })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                            type="date"
                            value={experience.endDate?.split("T")[0] || ""}
                            onChange={(e) =>
                                setExperience({
                                    ...experience,
                                    endDate: `${e.target.value}T00:00:00+05:30`,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Job Type</Label>
                        <Select
                            value={experience.jobType}
                            onValueChange={(value) =>
                                setExperience({ ...experience, jobType: value })
                            }
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
                    </div>
                    <div className="space-y-2">
                        <Label>Location Type</Label>
                        <Select
                            value={experience.locationType}
                            onValueChange={(value) =>
                                setExperience({
                                    ...experience,
                                    locationType: value,
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select location type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Remote">Remote</SelectItem>
                                <SelectItem value="Onsite">Onsite</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                        value={experience.location}
                        onChange={(e) =>
                            setExperience({
                                ...experience,
                                location: e.target.value,
                            })
                        }
                    />
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
