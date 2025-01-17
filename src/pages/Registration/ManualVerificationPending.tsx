import { motion } from "framer-motion"
import { ClipboardCheck, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ManualVerificationPending() {
    const handleContactSupport = () => {
        // Implement your contact support logic here
        console.log("Contacting support...")
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-8 p-6 md:p-10"
        >
            {/* Header Section */}
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <ClipboardCheck className="h-12 w-12 text-primary dark:text-primary-500" />
                    <h2 className="text-4xl font-bold font-philosopher text-primary dark:text-primary-500">
                        Manual Verification in Progress
                    </h2>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Your registration is currently under review. This process
                    may take up to 2 working days.
                </p>
            </div>

            {/* Verification Process Section */}
            <div className="space-y-6">
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Here's what's happening during the verification process:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        "Manual verification of your email address",
                        "Validation with the college office",
                        "Personal information verification",
                    ].map((step, index) => (
                        <li
                            key={index}
                            className="flex items-start space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="bg-primary dark:text-black font-bold text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                {index + 1}
                            </div>
                            <span className="text-base text-gray-700 dark:text-gray-300">
                                {step}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Explanation Section */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-lg font-semibold mb-4 text-primary dark:text-primary-500">
                    Why does this take time?
                </p>
                <p className="text-base text-gray-600 dark:text-gray-300">
                    Your email is not registered in the college Gradspace
                    website. To ensure the security and integrity of our
                    community, we need to perform additional checks with the
                    college office.
                </p>
            </div>

            {/* Contact Support Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0 sm:space-x-6">
                <p className="text-lg text-gray-600 dark:text-gray-300 text-center sm:text-left">
                    We appreciate your patience. You will be notified via email
                    once your registration is confirmed.
                </p>
                <Button
                    onClick={handleContactSupport}
                    className="w-full sm:w-auto bg-primary dark:bg-primary-600 hover:bg-primary/90 dark:hover:bg-primary-700 text-white dark:text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    <Mail className="mr-2 h-5 w-5" />
                    Contact Support
                </Button>
            </div>
        </motion.div>
    )
}
