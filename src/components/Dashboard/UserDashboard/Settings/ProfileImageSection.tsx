import { Trash2, Upload, User } from "lucide-react"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ProfileData } from "@/types/user/Profile"

interface ProfileImageSectionProps {
    profileData: ProfileData
    previewImage: string | null
    setPreviewImage: (image: string | null) => void
    handleProfileChange: <K extends keyof ProfileData["profile"]>(
        field: K,
        value: ProfileData["profile"][K]
    ) => void
}

export const ProfileImageSection = ({
    profileData,
    previewImage,
    setPreviewImage,
    handleProfileChange,
}: ProfileImageSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [showImageDialog, setShowImageDialog] = useState(false)
    console.log(profileData)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const previewReader = new FileReader()
            previewReader.onload = () => {
                setPreviewImage(previewReader.result as string)
                setShowImageDialog(false)
            }
            previewReader.readAsDataURL(file)

            const arrayBufferReader = new FileReader()
            arrayBufferReader.onloadend = () => {
                if (arrayBufferReader.result instanceof ArrayBuffer) {
                    handleProfileChange(
                        "profileImage",
                        arrayBufferReader.result
                    )
                }
            }
            arrayBufferReader.readAsArrayBuffer(file)
        }
    }

    const handleRemoveImage = () => {
        setPreviewImage(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        setShowImageDialog(false)
        handleProfileChange("profileImage", null)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <User className="w-16 h-16" />
                            </div>
                        )}
                    </div>
                    <Button
                        variant="link"
                        className="text-primary hover:text-primary/80 text-sm absolute -bottom-8 left-1/2 -translate-x-1/2"
                        onClick={() => setShowImageDialog(true)}
                    >
                        Change photo
                    </Button>
                </div>
                <h3 className="text-lg pt-5 font-semibold">SUJITH</h3>
            </div>

            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Profile Photo</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <Button
                            variant="outline"
                            className="h-12"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                        </Button>
                        {previewImage && (
                            <Button
                                variant="destructive"
                                className="h-12"
                                onClick={handleRemoveImage}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove Current Photo
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
            />
        </div>
    )
}
