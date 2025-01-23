import { motion } from "framer-motion"

import { useAuthStore } from "@/store/auth"
import { User } from "@/types/auth"
import { formatDate } from "@/utils/date"

const UserDashboard = () => {
    const { user, logout } = useAuthStore() as {
        user: User
        logout: () => void
    }

    const handleLogout = () => {
        logout()
    }
    return (
        <motion.div className=" min-h-screen w-full mx-auto  p-8 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800">
            <h2 className="text-3xl font-bold mb-6 text-violet-500 text-center">
                Dashboard
            </h2>

            <div className="space-y-6 flex flex-col items-center  p-4">
                <motion.div
                    className="p-4 max-w-md w-full   rounded-lg border border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-xl font-semibold mb-3">
                        Profile Information
                    </h3>
                    <p className="">Name: {user.username}</p>
                    <p className="">Email: {user.email}</p>
                    <h3 className="text-xl font-semibold mb-3">
                        Account Activity
                    </h3>
                    <p className="">
                        <span className="font-bold">Joined: </span>
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                    <p className="">
                        <span className="font-bold">Last Login: </span>

                        {formatDate(new Date(user.updated_at).toISOString())}
                    </p>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 max-w-md w-full mx-auto flex items-center justify-center"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="w-md py-3 px-4 bg-gradient-to-r from-violet-500 to-violet-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-violet-600 hover:to-violet-700
				 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                    Logout
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
export default UserDashboard
