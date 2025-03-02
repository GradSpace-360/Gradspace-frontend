import { motion } from "framer-motion"
import { Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"

const EventsPreview = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md"
        >
            <h2 className="text-3xl font-bold flex items-center mb-6">
                <Calendar className="mr-3" size={24} />
                Events
            </h2>
            <div className="event-list space-y-4">
                <div className="event-card p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">AI Seminar</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        20 May 2025
                    </p>
                </div>
                <div className="event-card p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">Hackathon</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        3-5 June 2025
                    </p>
                </div>
            </div>
            <Button className="primary mt-6">View All Events</Button>
        </motion.div>
    )
}

export default EventsPreview
