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
            className="max-w-2xl mx-auto space-y-6 p-6 bg-gradient-to-br from-card to-card/80 rounded-lg shadow-lg"
        >
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <ClipboardCheck className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-philosopher font-bold text-primary">
                        Manual Verification in Progress
                    </h2>
                </div>
                <p className="text-lg text-muted-foreground">
                    Your registration is currently under review. This process
                    may take up to 2 working days.
                </p>
            </div>

            <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">
                    Here's what's happening during the verification process:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        "Manual verification of your email address",
                        "Validation with the college office",
                        "Personal information verification",
                    ].map((step, index) => (
                        <li
                            key={index}
                            className="flex items-start space-x-2 bg-muted/50 p-3 rounded-md"
                        >
                            <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                {index + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-muted p-4 rounded-md border border-primary/20">
                <p className="text-sm font-semibold mb-2">
                    Why does this take time?
                </p>
                <p className="text-sm text-muted-foreground">
                    Your email is not registered in the college Gradspace
                    website. To ensure the security and integrity of our
                    community, we need to perform additional checks with the
                    college office.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                <p className="text-sm text-muted-foreground text-center sm:text-left">
                    We appreciate your patience. You will be notified via email
                    once your registration is confirmed.
                </p>
                <Button
                    onClick={handleContactSupport}
                    className="w-full sm:w-auto"
                >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                </Button>
            </div>
        </motion.div>
    )
}
