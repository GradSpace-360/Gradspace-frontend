import { motion } from "framer-motion"

const ProjectShelfPreview = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=" p-8 "
        >
            Project Shelf section under construction
        </motion.div>
    )
}

export default ProjectShelfPreview
