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
    name: string
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
            name: "",
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
                name: data.name,
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
                        <div className="flex justify-center mb-4">
                            <svg
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 text-violet-600 dark:text-violet-400"
                            >
                                <path
                                    d="M17.119 5.505a4.786 4.786 0 0 0-4.016-4.254c-2.188-.342-4.256.854-5.128 2.786-4.494-.278-7.784.257-7.966 1.47-.17 1.041 1.992 2.32 5.383 3.362l.001.006C5.308 8.841.333 22.807.333 22.807h18.803s-1.145-11.966-1.316-11.966c3.539.051 6-.496 6.172-1.539.178-1.188-2.662-2.682-6.873-3.797zm-.375 1.353c-.035.274-.309.479-.582.427s-.479-.308-.428-.581c.053-.273.309-.479.582-.427s.479.307.428.581zm-5.162-1.163a.67.67 0 0 1 .786-.564.67.67 0 0 1 .564.787.715.715 0 0 1-.786.564.67.67 0 0 1-.564-.787zm-3.949-.273c.051-.274.307-.479.581-.427s.479.308.427.581c-.034.273-.308.461-.581.427-.273-.051-.478-.308-.427-.581zm9.521 5.419c-.119.684-2.701.871-5.778.376-3.077-.495-5.47-1.453-5.368-2.153.068-.377.854-.599 2.051-.65-.358.067-.58.204-.614.376-.085.512 1.744 1.247 4.068 1.623 2.342.359 4.29.24 4.375-.291.018-.17-.154-.375-.479-.563 1.13.426 1.814.872 1.745 1.282z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                        <CardTitle className="text-3xl mb-10 font-bold text-center bg-gradient-to-r from-violet-500 to-violet-800 text-transparent bg-clip-text font-philosopher">
                            Create Account
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
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-700" />
                                    <Input
                                        type="text"
                                        placeholder="Full Name"
                                        className="pl-10 bg-violet-100 dark:bg-[#232b2b]"
                                        {...register("name", {
                                            required: "full name is required",
                                        })}
                                    />
                                </div>
                                {/* Full Name Error Display */}
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                {/* Email Input */}
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-700" />
                                    <Input
                                        type="email"
                                        placeholder="Email"
                                        className="pl-10 bg-violet-100 dark:bg-[#232b2b]"
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
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-700" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10 bg-violet-100 dark:bg-[#232b2b]"
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
                                <button
                                    type="submit"
                                    className="w-[70%] flex justify-center items-center  bg-gradient-to-r from-violet-500 to-violet-800 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white"
                                    disabled={isLoading}
                                >
                                    Sign Up
                                    <PulseLoader
                                        loading={isLoading}
                                        color="#ffffff"
                                        size={10}
                                    />
                                </button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center w-full mb-7">
                            Already have an account?{" "}
                            <Link
                                to={"/login"}
                                className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
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
