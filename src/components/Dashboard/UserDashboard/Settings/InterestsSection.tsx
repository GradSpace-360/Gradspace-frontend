import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InterestsSectionProps {
    interests: string[] | undefined
    newInterest: string
    setNewInterest: (value: string) => void
    addInterest: () => void
    removeInterest: (index: number) => void
}

export const InterestsSection = ({
    interests,
    newInterest,
    setNewInterest,
    addInterest,
    removeInterest,
}: InterestsSectionProps) => (
    <div className="space-y-4">
        <Label className="text-lg">Interests</Label>
        <div className="flex gap-2">
            <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new interest"
            />
            <Button variant="secondary" onClick={addInterest} className="w-32">
                Add Interest
            </Button>
        </div>
        <div className="flex flex-wrap gap-2">
            {interests?.map((interest, index) => (
                <Badge key={index} className="px-3 py-1">
                    {interest}
                    <button
                        onClick={() => removeInterest(index)}
                        className="ml-2 hover:text-destructive"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </Badge>
            ))}
        </div>
    </div>
)
