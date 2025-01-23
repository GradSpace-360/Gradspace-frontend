/**
 * Onboarding Store
 *
 * Manages the state for the user onboarding process using Zustand.
 * Handles steps, form data, and state reset functionality.
 */

import { toast } from "react-hot-toast"
import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"
import { OnboardingState, OnboardingStore } from "@/types/onboard"

const initialState: OnboardingState = {
    step: 1,
    formData: {
        profileImage: null, // Will store binary data (ArrayBuffer)
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

        // Append all form data to FormData object
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === "profileImage" && value instanceof ArrayBuffer) {
                    // Convert ArrayBuffer to Blob and append to FormData
                    const blob = new Blob([new Uint8Array(value)], {
                        type: "image/jpeg",
                    })
                    formDataToSend.append(key, blob, "profileImage.jpg")
                } else if (
                    typeof value === "object" &&
                    !(value instanceof ArrayBuffer)
                ) {
                    // Stringify nested objects (e.g., socialLinks)
                    formDataToSend.append(key, JSON.stringify(value))
                } else {
                    // Append other fields directly
                    formDataToSend.append(key, value as string | Blob)
                }
            }
        })

        try {
            console.log("Submitting form data:", formData)
            await axiosPrivate.post("/api/onboard", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            get().reset() // Reset the store after successful submission
            toast.success("Form submitted successfully!")
        } catch (error) {
            console.error("Submission failed:", error)
            toast.error("Failed to submit form.")
            throw error
        }
    },
}))
