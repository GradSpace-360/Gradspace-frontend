/**
 * ForgotPasswordPage Component
 * This component allows users to request a password reset link.
 */
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
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
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/store/auth"

interface ForgotPasswordFormData {
    email: string
}

const ForgotPasswordPage: React.FC = () => {
    const { forgotPassword, isLoading } = useAuthStore()
    // useForm hook to manage form state and validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: "",
        },
    })

    const [isSubmitted, setIsSubmitted] = useState(false)

    // Handler for form submission
    const handleForgotPassword = async (data: ForgotPasswordFormData) => {
        await forgotPassword(data.email)
        setIsSubmitted(true)
    }

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
                            Forgot Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form
                                onSubmit={handleSubmit(handleForgotPassword)}
                                className="space-y-4 mt-10"
                            >
                                <div>
                                    <div className="relative">
                                        <Mail className="absolute left-3 text-violet-700 top-1/2 transform -translate-y-1/2" />{" "}
                                        <Input
                                            placeholder="Email Address"
                                            type="email"
                                            className="pl-10  bg-violet-100 dark:bg-[#232b2b]"
                                            {...register("email", {
                                                required: "Email is required",
                                            })}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex justify-center"
                                >
                                    <button
                                        type="submit"
                                        className="w-[70%] flex justify-center items-center bg-gradient-to-r from-violet-500 to-violet-800 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white"
                                        disabled={isLoading}
                                    >
                                        Send Reset Link
                                        <PulseLoader
                                            loading={isLoading}
                                            color="#ffffff"
                                            size={10}
                                        />
                                    </button>
                                </motion.div>
                            </form>
                        ) : (
                            <div className="text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                    className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Mail className="h-8 w-8 text-white" />
                                </motion.div>
                                <p className="text-gray-500 dark:text-gray-300 mb-6">
                                    If an account exists for the provided email,
                                    you will receive a password reset link
                                    shortly.
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center justify-center"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
