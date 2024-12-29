import { Check, X } from "lucide-react"
import React from "react"

import { getStrength } from "@/utils/getStrength"

interface PasswordCriteriaProps {
    password: string
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ password }) => {
    const criteria = [
        { label: "At least 6 characters", met: password.length >= 6 },
        { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
        { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
        { label: "Contains a number", met: /\d/.test(password) },
        {
            label: "Contains special character",
            met: /[^A-Za-z0-9]/.test(password),
        },
    ]

    return (
        <div className="mt-2 space-y-1">
            {criteria.map((item) => (
                <div key={item.label} className="flex items-center text-xs">
                    {item.met ? (
                        <Check className="size-4 text-green-500 mr-2" />
                    ) : (
                        <X className="size-4 text-gray-500 mr-2" />
                    )}
                    <span
                        className={
                            item.met ? "text-green-500" : "text-gray-400"
                        }
                    >
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}

interface PasswordStrengthMeterProps {
    password: string
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
    password,
}) => {
    const strength = getStrength(password)

    const getColor = (strength: number): string => {
        if (strength === 0) return "bg-red-500"
        if (strength === 1) return "bg-red-400"
        if (strength === 2) return "bg-yellow-500"
        if (strength === 3) return "bg-yellow-400"
        return "bg-green-500"
    }

    const getStrengthText = (strength: number): string => {
        if (strength === 0) return "Very Weak"
        if (strength === 1) return "Weak"
        if (strength === 2) return "Fair"
        if (strength === 3) return "Good"
        return "Strong"
    }

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-violet-800">
                    Password strength
                </span>
                <span className="text-sm  text-violet-700">
                    {getStrengthText(strength)}
                </span>
            </div>

            <div className="flex space-x-1">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
              `}
                    />
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    )
}
export default PasswordStrengthMeter
