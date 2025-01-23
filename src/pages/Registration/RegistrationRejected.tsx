import { motion } from "framer-motion"
import { AlertCircle, Mail } from "lucide-react"

export default function RegistrationRejected() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-8 p-6 md:p-10 "
        >
            {/* Header Section */}

            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
                    <h2 className="text-4xl font-bold font-philosopher text-red-600 dark:text-red-500">
                        Registration Rejected
                    </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    We regret to inform you that your registration has been
                    rejected.
                </p>
            </div>

            {/* Rejection Reason Section */}
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                    Reason for Rejection:
                </p>
                <p className="text-base text-gray-600 dark:text-gray-300">
                    After verification, we found that you are not part of the
                    College of Engineering Adoor. This could be due to invalid
                    data provided during registration.
                </p>
            </div>

            {/* Next Steps Section */}
            <div className="space-y-6">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    What you can do next:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        "Double-check your registration information",
                        "Verify your affiliation with the college",
                        "Contact your college administration",
                        "Reach out to us for clarification",
                    ].map((step, index) => (
                        <li
                            key={index}
                            className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="bg-red-600 dark:bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                {index + 1}
                            </div>
                            <span className="text-base text-gray-700 dark:text-gray-300">
                                {step}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Assistance Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
                    Need further assistance?
                </p>
                <p className="text-base text-gray-600 dark:text-gray-300">
                    If you believe this is an error or need more information,
                    please don't hesitate to contact us. We're here to help
                    resolve any issues regarding your registration.
                </p>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col items-center opacity-85 justify-center space-y-1 ">
                <p className="text-xl  text-center">
                    For further inquiries, please contact us:
                </p>
                <a
                    href="mailto:gradspace338@gmail.com"
                    className="flex items-center justify-center space-x-3 opacity-85 hover:underline text-xl  transition-colors duration-200 hover:text-blue-700 dark:hover:text-blue-300"
                >
                    <Mail className="h-6 w-6" />
                    <span>gradspace338@gmail.com</span>
                </a>
            </div>
        </motion.div>
    )
}
