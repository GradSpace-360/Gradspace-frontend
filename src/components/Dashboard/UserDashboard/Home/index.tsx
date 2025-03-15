import { motion } from "framer-motion"

import { CreatePostForm } from "./CreatePostForm"
import { PostsList } from "./PostsList"

const HomePreview = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className=" max-w-md  px-1  xl:ml-32 mx-auto "
        >
            <div className="min-h-screen bg-background">
                <main className="container py-8">
                    <CreatePostForm />
                    <PostsList variant="global" />
                </main>
            </div>
        </motion.div>
    )
}

export default HomePreview
