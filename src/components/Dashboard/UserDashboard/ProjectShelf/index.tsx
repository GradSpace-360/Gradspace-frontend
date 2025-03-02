import { motion } from "framer-motion"
import { Layers } from "lucide-react"

import { Button } from "@/components/ui/button"

const ProjectShelfPreview = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md"
        >
            <h2 className="text-3xl font-bold flex items-center mb-6">
                <Layers className="mr-3" size={24} />
                Project Shelf
            </h2>
            <div className="project-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="project-card p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">AI Chatbot</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        React & Python integration
                    </p>
                    <Button variant="ghost" className=" ghost mt-2">
                        View Details
                    </Button>
                </div>
                <div className="project-card p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold">VR Museum App</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Three.js & WebRTC implementation
                    </p>
                    <Button variant="ghost" className="mt-2">
                        View Code
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}

export default ProjectShelfPreview
