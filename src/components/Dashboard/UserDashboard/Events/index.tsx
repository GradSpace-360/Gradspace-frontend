import { motion } from "framer-motion"

const EventsPreview = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8"
        >
            Events section under construction
        </motion.div>
    )
}

export default EventsPreview
