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
import { Link, useNavigate } from "react-router-dom"
import { PulseLoader } from "react-spinners"

import welcomeImg from "@/assets/lifestyle-students-talking-in-front-of-university-1.png"
import DotBackground from "@/components/DotBackground"
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

interface LoginFormData {
    email: string
    password: string
}

const Login: React.FC = () => {
    const { login, isLoading, error, clearError } = useAuthStore()
    const navigate = useNavigate()
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
        navigate("/dashboard")
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
                            <Link to="/">
                                <img
                                    src="./new_logo1.svg"
                                    className="w-20"
                                    alt=""
                                />
                            </Link>
                        </div>
                        <CardTitle className="text-3xl mb-10 font-bold text-center bg-primary text-transparent bg-clip-text font-philosopher">
                            gradSpace
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(handleLogin)}
                            className="space-y-4 mt-10"
                        >
                            <div>
                                <div className="relative">
                                    <Mail className="absolute left-3 text-black/80 dark:text-white top-1/2 transform -translate-y-1/2 " />
                                    <Input
                                        placeholder="Email Address"
                                        type="email"
                                        className="pl-10  bg-gray-200 dark:bg-white/10"
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
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/80 dark:text-white" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10   bg-gray-200   dark:bg-white/10"
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
                                    className="text-sm  hover:underline"
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
                                <Button
                                    type="submit"
                                    className="w-[70%] "
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <PulseLoader
                                            loading={true}
                                            color="#ffffff"
                                            size={10}
                                        />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-center w-full mb-7">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/signup"
                                className=" hover:underline font-medium"
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
