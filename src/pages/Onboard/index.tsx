/**
 * Onboarding Component
 *
 * Manages the user onboarding process by rendering the appropriate onboarding step
 * based on the current step in the state. Displays progress using a progress bar
 * and an illustration alongside the onboarding form steps.
 * Utilizes Framer Motion for animations and Zustand for state management.
 */

import { AnimatePresence } from "framer-motion"

import onBoardImg from "@/assets/3d-casual-life-business-woman-working-on-laptop-while-sitting-on-floor.png"
import DotBackground from "@/components/DotBackground"
import { CompletionStep } from "@/components/onboarding/CompletionStep"
import { EducationStep } from "@/components/onboarding/EducationStep"
import { ExperienceStep } from "@/components/onboarding/ExperienceStep"
import { ProgressBar } from "@/components/onboarding/ProgressBar"
import { SkillsStep } from "@/components/onboarding/SkillsStep"
import { SocialStep } from "@/components/onboarding/SocialStep"
import { WelcomeStep } from "@/components/onboarding/WelcomeStep"
import { useOnboardingStore } from "@/store/onboard"

export default function Onboarding() {
    const { step } = useOnboardingStore()
    const totalSteps = 5

    return (
        <div className="min-h-screen flex">
            <DotBackground />
            <div className="hidden lg:flex flex-col items-center justify-center p-8 w-1/2 fixed h-screen">
                <div className="max-w-md text-center">
                    <div className="relative w-full aspect-[4/3] mb-8">
                        <img
                            src={onBoardImg}
                            alt="Onboarding illustration"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-4xl font-philosopher font-bold tracking-tight mb-4 text-primary">
                        <span className="text-violet-600 dark:text-violet-600">
                            gradSpace
                        </span>{" "}
                        Onboarding
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome to your professional journey. Let's set up your
                        profile together.
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-auto lg:ml-[50%]">
                <div className="max-w-2xl mx-auto p-2 lg:p-6">
                    <div className="mb-0">
                        <ProgressBar
                            currentStep={step}
                            totalSteps={totalSteps}
                        />
                    </div>

                    <div className="rounded-lg pt-5">
                        <AnimatePresence mode="wait">
                            {step === 1 && <WelcomeStep key="welcome" />}
                            {step === 2 && <SkillsStep key="skills" />}
                            {step === 3 && <EducationStep key="education" />} /
                            {step === 4 && <ExperienceStep key="experience" />}
                            {step === 5 && <SocialStep key="social" />}
                            {step === 6 && <CompletionStep key="completion" />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
