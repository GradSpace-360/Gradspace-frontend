/**
 * 
 * feat(frontend): enhance email verification page with OTP resend cooldown and error handling

- Added a cooldown period for the 'Resend OTP' button to prevent spamming.
- Improved error handling by clearing OTP fields on verification failure.
- Added accessibility improvements to OTP input fields.
- Integrated backend API calls for sending and verifying OTP.
- Updated UI to display cooldown timer and error messages.
 */

import { motion } from "framer-motion"
import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"

// import welcomeImg from "@/assets/3d-casual-life-busy-female-student-min.png"
import DotBackground from "@/components/DotBackground"
import { Button } from "@/components/ui/button"
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
    const [resendDisabled, setResendDisabled] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const navigate = useNavigate()
    const { error, clearError, isLoading, verifyEmail, sendVerificationOtp } =
        useAuthStore()

    useEffect(clearError, [clearError])

    useEffect(() => {
        sendVerificationOtp()
    }, [sendVerificationOtp])

    const handleChange = (index: number, value: string) => {
        const newCode = [...code]

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

            const lastFilledIndex = findLastIndex(
                newCode,
                (digit) => digit !== ""
            )
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
            inputRefs.current[focusIndex]?.focus()
        } else {
            newCode[index] = value
            setCode(newCode)

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
                toast.success("Email verified successfully")
                navigate("/dashboard")
            } catch (error) {
                console.error(error)
                toast.error("Failed to verify email")
                setCode(["", "", "", "", "", ""]) // Clear OTP fields on error
            }
        },
        [code, navigate, verifyEmail]
    )

    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event("submit") as unknown as React.FormEvent)
        }
    }, [code, handleSubmit])

    const handleResendOTP = async () => {
        if (resendDisabled) return

        setResendDisabled(true)
        setCooldown(30)

        try {
            await sendVerificationOtp()
        } catch (error) {
            console.error("Failed to resend OTP:", error)
        }

        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev === 1) {
                    clearInterval(interval)
                    setResendDisabled(false)
                }
                return prev - 1
            })
        }, 1000)
    }

    return (
        <div className="flex min-h-screen justify-center">
            <DotBackground />
            {/* <div className="hidden sm:block w-1/3 lg:w-1/4">
                <img
                    src={welcomeImg}
                    className="object-contain h-screen w-[90%]"
                    alt="welcome-image"
                />
            </div> */}
            <div className="flex justify-center items-center w-full sm:w-1/2">
                <Card className="w-full max-w-md z-50 bg-transparent border-0 shadow-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl mb-10 font-bold text-center font-philosopher">
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
                                        className="w-12 h-12 text-center text-2xl font-bold bg-violet-100 dark:bg-[#232b2b] border-2 border-violet-300 rounded-lg focus:border-violet-500 focus:outline-none"
                                        aria-label={`OTP digit ${index + 1}`}
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
                                <Button
                                    type="submit"
                                    className="w-[70%]"
                                    disabled={
                                        isLoading ||
                                        code.some((digit) => !digit)
                                    }
                                >
                                    {isLoading ? (
                                        <PulseLoader
                                            loading={true}
                                            color="#ffffff"
                                            size={10}
                                        />
                                    ) : (
                                        "Verify Email"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="text-center w-full">
                            <p className="text-sm">
                                Didn't receive the code?{" "}
                                <button
                                    onClick={handleResendOTP}
                                    disabled={resendDisabled}
                                    className="hover:underline font-semibold"
                                >
                                    {resendDisabled
                                        ? `Resend in ${cooldown}s`
                                        : "Resend"}
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
