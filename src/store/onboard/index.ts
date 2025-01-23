/**
 * Onboarding Store
 *
 * Manages the state for the user onboarding process using Zustand.
 * Persists state between sessions with Zustand's persist middleware.
 * Handles steps, form data, and state reset functionality.
 */

import { toast } from "react-hot-toast"
import { create } from "zustand"
import { persist } from "zustand/middleware"

import { axiosPrivate } from "@/config/axiosInstance"
import { OnboardingState, OnboardingStore } from "@/types/onboard"

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

export const useOnboardingStore = create<OnboardingStore>()(
    persist(
        (set, get) => ({
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

                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formDataToSend.append(key, JSON.stringify(value))
                    }
                })

                try {
                    console.log("Submitting form data:", formData)
                    await axiosPrivate.post("/api/onboard", formDataToSend, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    get().reset()
                    toast.success("Form submitted successfully!")
                } catch (error) {
                    console.error("Submission failed:", error)
                    toast.error("Failed to submit form.")
                    throw error
                }
            },
        }),
        {
            name: "onboarding-storage",
        }
    )
)
