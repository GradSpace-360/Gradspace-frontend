import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SkillsSectionProps {
    skills: string[] | undefined
    newSkill: string
    setNewSkill: (value: string) => void
    addSkill: () => void
    removeSkill: (index: number) => void
}

export const SkillsSection = ({
    skills,
    newSkill,
    setNewSkill,
    addSkill,
    removeSkill,
}: SkillsSectionProps) => (
    <div className="space-y-4">
        <Label className="text-lg">Skills</Label>
        <div className="flex gap-2">
            <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add new skill"
            />
            <Button className="w-32" variant="secondary" onClick={addSkill}>
                Add Skill
            </Button>
        </div>
        <div className="flex flex-wrap gap-2">
            {skills?.map((skill, index) => (
                <Badge key={index} className="px-3 py-1">
                    {skill}
                    <button
                        onClick={() => removeSkill(index)}
                        className="ml-2 hover:text-destructive"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </Badge>
            ))}
        </div>
    </div>
)
