// store/index.ts

/**
 * Onboarding Store
 *
 * Manages the state for the user onboarding process using Zustand.
 * Persists state between sessions with Zustand's persist middleware.
 * Handles steps, form data, and state reset functionality.
 */

import { create } from "zustand"
import { persist } from "zustand/middleware"

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
        (set) => ({
            ...initialState,
            setStep: (step) => set({ step }),
            setFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data },
                })),
            reset: () => set(initialState),
        }),
        {
            name: "onboarding-storage",
        }
    )
)
