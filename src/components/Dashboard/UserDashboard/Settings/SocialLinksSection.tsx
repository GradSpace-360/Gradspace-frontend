import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialLinks } from "@/types/user/Profile"

interface SocialLinksSectionProps {
    socialLinks: SocialLinks | undefined
    handleSocialLinksChange: (
        platform: keyof SocialLinks,
        value: string
    ) => void
}

export const SocialLinksSection = ({
    socialLinks,
    handleSocialLinksChange,
}: SocialLinksSectionProps) => (
    <div className="space-y-4">
        <Label className="text-lg">Social Links</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                    value={socialLinks?.linkedin || ""}
                    onChange={(e) =>
                        handleSocialLinksChange("linkedin", e.target.value)
                    }
                    placeholder="https://linkedin.com/in/username"
                />
            </div>
            <div className="space-y-2">
                <Label>GitHub</Label>
                <Input
                    value={socialLinks?.github || ""}
                    onChange={(e) =>
                        handleSocialLinksChange("github", e.target.value)
                    }
                    placeholder="https://github.com/username"
                />
            </div>
            <div className="space-y-2">
                <Label>Website</Label>
                <Input
                    value={socialLinks?.website || ""}
                    onChange={(e) =>
                        handleSocialLinksChange("website", e.target.value)
                    }
                    placeholder="https://yourwebsite.com"
                />
            </div>
            <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                    value={socialLinks?.instagram || ""}
                    onChange={(e) =>
                        handleSocialLinksChange("instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/username"
                />
            </div>
            <div className="space-y-2 ">
                <Label>Resume</Label>
                <Input
                    value={socialLinks?.resume || ""}
                    onChange={(e) =>
                        handleSocialLinksChange("resume", e.target.value)
                    }
                    placeholder="https://example.com/resume.pdf"
                />
            </div>
        </div>
    </div>
)
