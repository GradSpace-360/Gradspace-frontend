/* This component handles the email verification process by allowing users to input a 6-digit verification code.
It manages input focus, handles code submission, and displays error messages if verification fails.
Integrates with the authentication store to verify the email and navigate upon successful verification.
*/

"use client"

import { motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"

import welcomeImg from "@/assets/3d-casual-life-busy-female-student-min.png"
import DotBackground from "@/components/DotBackground"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useAuthStore } from "@/store/auth"

const EmailVerificationPage: React.FC = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const navigate = useNavigate()
    const { error, isLoading, verifyEmail } = useAuthStore()

    const handleChange = (index: number, value: string) => {
        const newCode = [...code]

        // Handle pasted content
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("")
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || ""
            }
            setCode(newCode)
            const findLastIndex = (
                arr: string[],
                predicate: (value: string) => boolean
            ): number => {
                for (let i = arr.length - 1; i >= 0; i--) {
                    if (predicate(arr[i])) return i
                }
                return -1
            }

            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = findLastIndex(
                newCode,
                (digit) => digit !== ""
            )
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
            inputRefs.current[focusIndex]?.focus()
        } else {
            newCode[index] = value
            setCode(newCode)

            // Move focus to the next input field if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus()
            }
        }
    }

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault()
            const verificationCode = code.join("")
            try {
                await verifyEmail(verificationCode)
                navigate("/")
            } catch (error) {
                console.error(error)
            }
        },
        [code, navigate, verifyEmail]
    )

    // Auto submit when all fields are filled
    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event("submit") as unknown as React.FormEvent)
        }
    }, [code, handleSubmit])

    return (
        <div className="flex min-h-screen justify-center">
            <DotBackground />
            <div className="hidden sm:block w-1/3 lg:w-1/4">
                <img
                    src={welcomeImg}
                    className="object-contain h-screen w-[90%]"
                    alt="welcome-image"
                />
            </div>
            <div className="flex justify-center items-center w-full sm:w-1/2">
                <Card className="w-full max-w-md z-50 bg-transparent border-0 shadow-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl mb-10 font-bold text-center bg-gradient-to-r from-violet-500 to-violet-800 text-transparent bg-clip-text font-philosopher">
                            Verify Your Email
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 mt-10"
                        >
                            <div className="flex justify-between">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) =>
                                            (inputRefs.current[index] = el)
                                        }
                                        type="text"
                                        maxLength={6}
                                        value={digit}
                                        onChange={(e) =>
                                            handleChange(index, e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(index, e)
                                        }
                                        className="w-12 h-12 text-center text-2xl font-bold bg-violet-100 dark:bg-[#232b2b] text-violet-700 dark:text-white border-2 border-violet-300 dark:border-violet-700 rounded-lg focus:border-violet-500 focus:outline-none"
                                    />
                                ))}
                            </div>
                            {error && (
                                <p className="text-red-500 text-sm text-center mt-2">
                                    {error}
                                </p>
                            )}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex justify-center"
                            >
                                <button
                                    type="submit"
                                    className="w-[70%] flex justify-center items-center bg-gradient-to-r from-violet-500 to-violet-800 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white"
                                    disabled={
                                        isLoading ||
                                        code.some((digit) => !digit)
                                    }
                                >
                                    {isLoading ? (
                                        <PulseLoader
                                            color="#ffffff"
                                            size={10}
                                        />
                                    ) : (
                                        "Verify Email"
                                    )}
                                </button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="text-center w-full">
                            <p className="text-sm text-violet-600 dark:text-violet-400">
                                Didn't receive the code?{" "}
                                <button className="hover:underline font-semibold">
                                    Resend
                                </button>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default EmailVerificationPage
