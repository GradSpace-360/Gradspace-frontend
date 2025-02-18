import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { axiosPrivate } from "@/config/axiosInstance"
import { useAuthStore } from "@/store/auth"
import { useProfileStore } from "@/store/user/profile"
import {
    Education,
    Experience,
    ProfileData,
    SocialLinks,
} from "@/types/user/Profile"

import { ActionButtons } from "./ActionButtons"
import { BasicInfoSection } from "./BasicInfoSection"
import { EducationSection } from "./EducationSection"
import { ExperienceSection } from "./ExperienceSection"
import { InterestsSection } from "./InterestsSection"
import { ProfileImageSection } from "./ProfileImageSection"
import { SkillsSection } from "./SkillsSection"
import { SocialLinksSection } from "./SocialLinksSection"

const SettingsPreview = () => {
    const { profileData, fetchProfile, updateProfile } = useProfileStore()
    const { user } = useAuthStore()
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<ProfileData>>({
        profile: {
            headline: "",
            about: "",
            location: "",
            skills: [],
            interests: [],
            profileImage: null,
        },
        educations: [],
        experiences: [],
        socialLinks: {
            github: "",
            instagram: "",
            linkedin: "",
            resume: "",
            website: "",
        },
    })
    const [newSkill, setNewSkill] = useState("")
    const [newInterest, setNewInterest] = useState("")

    // Fetch profile data on mount
    useEffect(() => {
        if (user?.username) {
            fetchProfile(user.username)
        }
    }, [user?.username, fetchProfile])
    // Fetch profile data on mount
    useEffect(() => {
        if (!profileData) fetchProfile(user?.username || "")
        if (profileData?.profile.profileImage) {
            setPreviewImage(
                `${axiosPrivate.defaults.baseURL}/${profileData.profile.profileImage}`
            )
        }
    }, [profileData, fetchProfile, user])

    // Sync formData with profileData
    useEffect(() => {
        if (profileData) {
            setFormData({
                ...profileData,
                profile: {
                    headline: profileData.profile?.headline || "",
                    about: profileData.profile?.about || "",
                    location: profileData.profile?.location || "",
                    skills: profileData.profile?.skills || [],
                    interests: profileData.profile?.interests || [],
                    profileImage: profileData.profile?.profileImage || null,
                },
            })
        }
    }, [profileData])

    // Handlers
    const handleProfileChange = <K extends keyof ProfileData["profile"]>(
        field: K,
        value: ProfileData["profile"][K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            profile: {
                ...(prev.profile || {
                    headline: "",
                    about: "",
                    location: "",
                    skills: [],
                    interests: [],
                    profileImage: null,
                }),
                [field]: value,
            },
        }))
    }

    const handleSocialLinksChange = (
        platform: keyof SocialLinks,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            socialLinks: {
                ...((prev.socialLinks || {}) as SocialLinks),
                [platform]: value,
            },
        }))
    }

    const handleEducationChange = (
        index: number,
        field: keyof Education,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            educations: prev.educations?.map((edu, i) =>
                i === index ? { ...edu, [field]: value } : edu
            ),
        }))
    }

    const handleExperienceChange = (
        index: number,
        field: keyof Experience,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences?.map((exp, i) =>
                i === index ? { ...exp, [field]: value } : exp
            ),
        }))
    }

    const handleAddEducation = (education: Education) => {
        setFormData((prev) => ({
            ...prev,
            educations: [...(prev.educations || []), education],
        }))
    }

    const handleAddExperience = (experience: Experience) => {
        setFormData((prev) => ({
            ...prev,
            experiences: [...(prev.experiences || []), experience],
        }))
    }

    const removeEducation = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            educations: prev.educations?.filter((_, i) => i !== index),
        }))
    }

    const removeExperience = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            experiences: prev.experiences?.filter((_, i) => i !== index),
        }))
    }

    const addSkill = () => {
        if (newSkill.trim()) {
            setFormData((prev) => ({
                ...prev,
                profile: {
                    ...(prev.profile || {
                        headline: "",
                        about: "",
                        location: "",
                        skills: [],
                        interests: [],
                        profileImage: null,
                    }),
                    skills: [...(prev.profile?.skills || []), newSkill.trim()],
                },
            }))
            setNewSkill("")
        }
    }

    const removeSkill = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            profile: {
                ...(prev.profile || {
                    headline: "",
                    about: "",
                    location: "",
                    skills: [],
                    interests: [],
                    profileImage: null,
                }),
                skills: (prev.profile?.skills || []).filter(
                    (_, i) => i !== index
                ),
            },
        }))
    }

    const addInterest = () => {
        if (newInterest.trim()) {
            setFormData((prev) => ({
                ...prev,
                profile: {
                    ...(prev.profile || {
                        headline: "",
                        about: "",
                        location: "",
                        skills: [],
                        interests: [],
                        profileImage: null,
                    }),
                    interests: [
                        ...(prev.profile?.interests || []),
                        newInterest.trim(),
                    ],
                },
            }))
            setNewInterest("")
        }
    }

    const removeInterest = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            profile: {
                ...(prev.profile || {
                    headline: "",
                    about: "",
                    location: "",
                    skills: [],
                    interests: [],
                    profileImage: null,
                }),
                interests: (prev.profile?.interests || []).filter(
                    (_, i) => i !== index
                ),
            },
        }))
    }

    const handleSubmit = async () => {
        if (profileData?.user.userName) {
            try {
                const submitData = {
                    ...formData,
                    profile: {
                        headline: formData.profile?.headline || "",
                        about: formData.profile?.about || "",
                        location: formData.profile?.location || "",
                        skills: formData.profile?.skills || [],
                        interests: formData.profile?.interests || [],
                        profileImage: formData.profile?.profileImage || null,
                    },
                }
                await updateProfile(profileData.user.userName, submitData)
            } catch (error) {
                console.log("Update failed:", error)
            }
        }
    }

    const handleCancel = () => {
        if (profileData) {
            setFormData({
                ...profileData,
                profile: {
                    headline: profileData.profile?.headline || "",
                    about: profileData.profile?.about || "",
                    location: profileData.profile?.location || "",
                    skills: profileData.profile?.skills || [],
                    interests: profileData.profile?.interests || [],
                    profileImage: profileData.profile?.profileImage || null,
                },
            })
        }
    }

    if (!profileData) return <div className="p-8">Loading profile...</div>

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 space-y-8 max-w-4xl mx-auto"
        >
            <Card className="border-none shadow-none">
                <CardHeader></CardHeader>
                <CardContent className="space-y-6">
                    <ProfileImageSection
                        profileData={profileData}
                        previewImage={previewImage}
                        setPreviewImage={setPreviewImage}
                        handleProfileChange={handleProfileChange}
                    />

                    <BasicInfoSection
                        formData={formData}
                        handleProfileChange={handleProfileChange}
                    />

                    <EducationSection
                        educations={formData.educations}
                        handleEducationChange={handleEducationChange}
                        removeEducation={removeEducation}
                        onAddEducation={handleAddEducation}
                    />

                    <ExperienceSection
                        experiences={formData.experiences}
                        handleExperienceChange={handleExperienceChange}
                        removeExperience={removeExperience}
                        onAddExperience={handleAddExperience}
                    />

                    <SkillsSection
                        skills={formData.profile?.skills}
                        newSkill={newSkill}
                        setNewSkill={setNewSkill}
                        addSkill={addSkill}
                        removeSkill={removeSkill}
                    />

                    <InterestsSection
                        interests={formData.profile?.interests}
                        newInterest={newInterest}
                        setNewInterest={setNewInterest}
                        addInterest={addInterest}
                        removeInterest={removeInterest}
                    />

                    <SocialLinksSection
                        socialLinks={formData.socialLinks}
                        handleSocialLinksChange={handleSocialLinksChange}
                    />

                    <ActionButtons
                        onCancel={handleCancel}
                        onSubmit={handleSubmit}
                    />
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default SettingsPreview
