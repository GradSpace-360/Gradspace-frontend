/**
 * Login Component
 *
 * This component renders the login form for users to authenticate into the Gradspace application.
 * It utilizes react-hook-form for form state management and validation.
 * The form includes fields for email and password, with appropriate validation messages.
 * Upon submission, it triggers the login function from the authentication store.
 * It also handles loading states and displays error messages when authentication fails.
 */

import { motion } from "framer-motion"
import { Lock, Mail } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { PulseLoader } from "react-spinners"

import welcomeImg from "@/assets/lifestyle-students-talking-in-front-of-university-1.png"
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

interface LoginFormData {
    email: string
    password: string
}

const Login: React.FC = () => {
    const { login, isLoading, error, clearError } = useAuthStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
    })
    useEffect(clearError, [clearError])

    const handleLogin = async (data: LoginFormData) => {
        await login(data.email, data.password)
    }

    return (
        <div className="flex  min-h-screen justify-center">
            <DotBackground />
            <div className="hidden sm:block  w-1/3">
                {/* <AnimatedLogo facefill={true} /> */}
                <img
                    src={welcomeImg}
                    className=" object-contain h-screen w-full"
                    alt="welcome-image"
                />
            </div>
            <div className="flex justify-center items-center bg-transparent   w-full sm:w-1/2 ">
                <Card className="w-full max-w-md  z-50 bg-transparent border-0 shadow-none ">
                    {/* bg-[#ffffef] dark:bg-[#09090d] */}
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
                            Welcome Back
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(handleLogin)}
                            className="space-y-4 mt-10"
                        >
                            <div>
                                <div className="relative">
                                    <Mail className="absolute left-3 text-violet-700 top-1/2 transform -translate-y-1/2 " />
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
                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-700" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10  bg-violet-100 dark:bg-[#232b2b]"
                                        {...register("password", {
                                            required: "Password is required",
                                        })}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-end">
                                <Link
                                    to="/forgot-Password"
                                    className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            {error && (
                                <p className="text-red-500 text-center font-semibold text-sm">
                                    {error}
                                </p>
                            )}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex justify-center "
                            >
                                <button
                                    type="submit"
                                    className="w-[70%] flex justify-center items-center bg-gradient-to-r from-violet-500 to-violet-800 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white"
                                    disabled={isLoading}
                                >
                                    Log In
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
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/signup"
                                className="text-violet-600 dark:text-violet-400 hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default Login
