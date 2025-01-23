/**
 * SignUp Component
 * It utilizes react-hook-form for form state management and validation.
 * The form includes fields for full name, email, and password, with appropriate validation messages.
 * A password strength meter is included to ensure strong passwords.
 * Upon submission, it triggers the signUp function from the authentication store and navigates to email verification.
 * It also handles loading states and displays error messages when sign-up fails.
 */

import { motion } from "framer-motion"
import { Lock, Mail, User } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"

import welcomeImg from "@/assets/lifestyle-students-talking-in-front-of-university-1.png"
import DotBackground from "@/components/DotBackground"
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/store/auth"
import { getStrength } from "@/utils/getStrength"

interface SignUpFormData {
    email: string
    password: string
    username: string
}

const SignUp: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<SignUpFormData>({
        defaultValues: {
            email: "",
            password: "",
            username: "",
        },
    })
    const { signUp, error, isLoading, clearError } = useAuthStore()
    const navigate = useNavigate()

    useEffect(clearError, [clearError])

    const handleSignUp = async (data: SignUpFormData) => {
        if (getStrength(data.password) < 3) {
            toast.error("Password is weak")
            return
        }
        try {
            await signUp({
                email: data.email,
                password: data.password,
                username: data.username,
            })
            navigate("/verify-email")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex  min-h-screen justify-center">
            <DotBackground />
            <div className="hidden sm:block  w-1/3">
                <img
                    src={welcomeImg}
                    className=" object-contain h-screen w-full"
                    alt="welcome-image"
                />
            </div>
            <div className="flex justify-center items-center bg-transparent   w-full sm:w-1/2 ">
                <Card className="w-full max-w-md  z-50 bg-transparent border-0 shadow-none ">
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-2">
                            <img
                                src="./new_logo1.svg"
                                className="w-20"
                                alt=""
                            />
                        </div>
                        <CardTitle className="text-3xl mb-3 font-bold text-center font-philosopher">
                            gradSpace
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={handleSubmit(handleSignUp)}
                            className="space-y-4 mt-10"
                        >
                            <div>
                                {/* Full Name Input */}
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/80 dark:text-white" />
                                    <Input
                                        type="text"
                                        placeholder="user name"
                                        className="pl-10  bg-gray-200 dark:bg-white/10"
                                        {...register("username", {
                                            required: "full name is required",
                                        })}
                                    />
                                </div>
                                {/* User name Error Display */}
                                {errors.username && (
                                    <p className="text-red-500 text-sm">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                {/* Email Input */}
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/80 dark:text-white" />
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        className="pl-10  bg-gray-200 dark:bg-white/10"
                                        {...register("email", {
                                            required: "Email is required",
                                        })}
                                    />
                                </div>
                                {/* Email Error Display */}
                                {errors.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                {/* Password Input */}
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/80 dark:text-white" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10  bg-gray-200 dark:bg-white/10"
                                        {...register("password", {
                                            required: "Password is required",
                                        })}
                                    />
                                </div>
                                {/* Password Error Display */}
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {error && (
                                <p className="text-red-500 text-center font-semibold mt-2">
                                    {error}
                                </p>
                            )}
                            {/* password strength meter */}
                            <PasswordStrengthMeter
                                password={watch("password")}
                            />
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex justify-center "
                            >
                                <Button
                                    type="submit"
                                    className="w-[70%] "
                                    disabled={isLoading}
                                >
                                    Sign Up
                                    <PulseLoader
                                        loading={isLoading}
                                        color="#ffffff"
                                        size={10}
                                    />
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-center w-full mb-7">
                            Already have an account?{" "}
                            <Link
                                to={"/login"}
                                className=" hover:underline font-medium"
                            >
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default SignUp
