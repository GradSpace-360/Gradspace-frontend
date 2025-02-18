import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProfileData } from "@/types/user/Profile"

interface BasicInfoSectionProps {
    formData: Partial<ProfileData>
    handleProfileChange: <K extends keyof ProfileData["profile"]>(
        field: K,
        value: ProfileData["profile"][K]
    ) => void
}

export const BasicInfoSection = ({
    formData,
    handleProfileChange,
}: BasicInfoSectionProps) => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label>Headline</Label>
            <Input
                value={formData.profile?.headline || ""}
                onChange={(e) =>
                    handleProfileChange("headline", e.target.value)
                }
                placeholder="Your professional headline"
            />
        </div>
        <div className="space-y-2">
            <Label>About</Label>
            <Textarea
                value={formData.profile?.about || ""}
                onChange={(e) => handleProfileChange("about", e.target.value)}
                placeholder="Describe yourself"
                rows={4}
            />
        </div>
        <div className="space-y-2">
            <Label>Location</Label>
            <Input
                value={formData.profile?.location || ""}
                onChange={(e) =>
                    handleProfileChange("location", e.target.value)
                }
                placeholder="Your location"
            />
        </div>
    </div>
)
