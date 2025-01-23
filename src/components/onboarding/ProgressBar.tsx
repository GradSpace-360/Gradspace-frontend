/**
 * ProgressBar Component
 *
 * Displays a progress bar that visually represents the current step out of the total steps.
 * Utilizes Framer Motion for smooth width animations.
 *
 * @param {number} currentStep - The current active step.
 * @param {number} totalSteps - The total number of steps.
 */

import { motion } from "framer-motion"

interface ProgressBarProps {
    currentStep: number
    totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="w-full h-1 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    )
}
