/**
 * Onboarding Store
 *
 * Manages the state for the user onboarding process using Zustand.
 * Handles steps, form data, and state reset functionality.
 */
import { toast } from "react-hot-toast"
import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

interface OnboardingState {
    step: number
    formData: {
        profileImage: ArrayBuffer | null
        headline: string
        about: string
        location: string
        skills: string[]
        interests: string[]
        education: Array<{
            institutionName: string
            course: string
            location: string
            startDate: Date
            endDate: Date
            grade: string
        }>
        experience: Array<{
            companyName: string
            position: string
            startDate: Date
            endDate: Date | "Present"
            jobType: "Full-time" | "Part-time" | "Internship" | "Freelance"
            locationType: "Remote" | "Onsite" | "Hybrid"
            location: string
        }>
        socialLinks: {
            github: string
            instagram: string
            linkedin: string
            website: string
            resume: string
        }
    }
}

interface OnboardingStore extends OnboardingState {
    setStep: (step: number) => void
    setFormData: (data: Partial<OnboardingState["formData"]>) => void
    reset: () => void
    submitFormData: () => Promise<void>
}

const initialState: OnboardingState = {
    step: 1,
    formData: {
        profileImage: null,
        headline: "",
        about: "",
        location: "",
        skills: [],
        interests: [],
        education: [],
        experience: [],
        socialLinks: {
            github: "",
            instagram: "",
            linkedin: "",
            website: "",
            resume: "",
        },
    },
}

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
    ...initialState,
    setStep: (step) => set({ step }),
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),
    reset: () => set(initialState),
    submitFormData: async () => {
        const { formData } = get()
        const formDataToSend = new FormData()

        // Append profile image
        if (formData.profileImage) {
            const blob = new Blob([new Uint8Array(formData.profileImage)], {
                type: "image/jpeg",
            })
            formDataToSend.append("profile_image", blob, "profile.jpg")
        }

        // Append text fields
        formDataToSend.append("headline", formData.headline)
        formDataToSend.append("about", formData.about)
        formDataToSend.append("location", formData.location)
        // Append social links
        formDataToSend.append(
            "social_links",
            JSON.stringify(formData.socialLinks)
        )

        // Append arrays
        formData.skills.forEach((skill) =>
            formDataToSend.append("skills[]", skill)
        )
        formData.interests.forEach((interest) =>
            formDataToSend.append("interests[]", interest)
        )

        // Append experiences and educations
        formData.experience.forEach((exp, idx) => {
            formDataToSend.append(
                `experiences[${idx}]`,
                JSON.stringify({
                    ...exp,
                    startDate: exp.startDate.toISOString(),
                    endDate:
                        exp.endDate === "Present"
                            ? null
                            : exp.endDate?.toISOString(),
                })
            )
        })

        formData.education.forEach((edu, idx) => {
            formDataToSend.append(
                `educations[${idx}]`,
                JSON.stringify({
                    ...edu,
                    startDate: edu.startDate.toISOString(),
                    endDate: edu.endDate?.toISOString(),
                })
            )
        })

        try {
            await axiosPrivate.post("/onboard/complete", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            })
            toast.success("Onboarding completed successfully!")
        } catch (error) {
            toast.error("Failed to submit onboarding data")
            throw error
        }
    },
}))
