"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsOfService({ onClose }: { onClose: () => void }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                GradSpace Terms of Service
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <ScrollArea className="h-[60vh]">
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p>
                                    Welcome to GradSpace. By using our platform,
                                    you agree to these Terms of Service:
                                </p>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    1. User Conduct
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        Treat all members with respect and
                                        professionalism.
                                    </li>
                                    <li>
                                        Do not engage in harassment,
                                        discrimination, or bullying.
                                    </li>
                                    <li>
                                        Protect your account credentials and do
                                        not share them with others.
                                    </li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    2. Content Guidelines
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        Share only appropriate and relevant
                                        content.
                                    </li>
                                    <li>
                                        Respect intellectual property rights; do
                                        not post copyrighted material without
                                        permission.
                                    </li>
                                    <li>
                                        Do not post false, misleading, or
                                        fraudulent information.
                                    </li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    3. Privacy and Data
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Respect the privacy of other users.</li>
                                    <li>
                                        Do not collect or harvest data from the
                                        platform without explicit permission.
                                    </li>
                                    <li>
                                        Review our Privacy Policy for details on
                                        data handling and your rights.
                                    </li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    4. Marketplace Conduct
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        Engage in fair and honest transactions.
                                    </li>
                                    <li>
                                        Accurately describe items or services
                                        you're offering.
                                    </li>
                                    <li>
                                        Report any suspicious or fraudulent
                                        activity.
                                    </li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    5. Job Portal Usage
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        Post only genuine job opportunities or
                                        internships.
                                    </li>
                                    <li>
                                        Provide accurate information in your
                                        professional profile.
                                    </li>
                                    <li>
                                        Respect the confidentiality of
                                        information shared during recruitment
                                        processes.
                                    </li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    6. Event Participation
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>
                                        Adhere to the specific guidelines of
                                        each event you participate in.
                                    </li>
                                    <li>
                                        Respect the time and effort of event
                                        organizers and other participants.
                                    </li>
                                </ul>

                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    7. Termination of Service
                                </h3>
                                <p>
                                    GradSpace reserves the right to terminate or
                                    suspend your account for violations of these
                                    terms or for any other reason deemed
                                    necessary to protect the platform and its
                                    users.
                                </p>

                                <p className="mt-4">
                                    By using GradSpace, you acknowledge that you
                                    have read, understood, and agree to be bound
                                    by these Terms of Service. GradSpace
                                    reserves the right to modify these terms at
                                    any time, and it is your responsibility to
                                    review them periodically.
                                </p>
                            </div>
                        </ScrollArea>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={onClose}>I Agree</Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
