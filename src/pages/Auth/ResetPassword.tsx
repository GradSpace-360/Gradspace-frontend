/**
 * ResetPasswordPage Component
 *
 * This component renders the Reset Password page where users can set a new password
 * using a token provided in the URL. It handles form submission, validates the
 * passwords, interacts with the authentication store (useAuthStore) to reset the password, and
 * provides user feedback through toast notifications.
 */
import { motion } from "framer-motion"
import { Lock } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate, useParams } from "react-router-dom"
import { PulseLoader } from "react-spinners"

// import welcomeImg from "@/assets/3d-casual-life-business-woman-working-on-laptop-while-sitting-on-floor.png"
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
import { CustomError } from "@/types/common"

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const { resetPassword, isLoading, error, clearError, message } =
        useAuthStore()
    useEffect(clearError, [clearError])
    const { token } = useParams() // Retrieving the token from the URL parameters
    const navigate = useNavigate()

    // Handler for form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        try {
            await resetPassword(token!, password)
            toast.success(
                "Password reset successfully, redirecting to login page..."
            )
            setTimeout(() => {
                navigate("/login")
            }, 1000)
        } catch (error) {
            console.error(error)
            const customError = error as CustomError
            toast.error(
                customError.response?.data?.message ||
                    "Error resetting password"
            )
        }
    }

    return (
        <div className="flex min-h-screen w-full justify-center">
            <DotBackground />
            {/* <div className="hidden sm:block w-1/3">
                <img
                    src={welcomeImg}
                    className=" object-contain h-screen w-full"
                    alt="welcome-image"
                />
            </div> */}
            <div className="flex justify-center items-center sm:w-1/2 w-full">
                <Card className="w-full max-w-md z-50 bg-transparent border-0 shadow-none">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-3xl mb-10 font-bold text-center   font-philosopher">
                            Reset Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}
                        {message && (
                            <p className="text-violet-500 text-sm mb-4">
                                {message}
                            </p>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 mt-10"
                        >
                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-3 text-black/80 dark:text-white top-1/2 transform -translate-y-1/2" />{" "}
                                    <Input
                                        placeholder="New Password"
                                        type="password"
                                        className="pl-10  bg-gray-200   dark:bg-white/10"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-3 text-black/80 dark:text-white top-1/2 transform -translate-y-1/2" />{" "}
                                    <Input
                                        placeholder="Confirm New Password"
                                        type="password"
                                        className="pl-10  bg-gray-200   dark:bg-white/10"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex justify-center"
                            >
                                <Button
                                    type="submit"
                                    className="w-[70%] "
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            Resetting <PulseLoader />
                                        </>
                                    ) : (
                                        "Set New Password"
                                    )}{" "}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="text-sm  hover:underline flex items-center justify-center"
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

export default ResetPasswordPage
