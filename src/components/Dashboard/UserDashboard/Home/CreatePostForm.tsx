import { ImageIcon, X } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { usePostStore } from "@/store/user/post"

export function CreatePostForm() {
    const { createPost } = usePostStore()
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const content = textareaRef.current?.value || ""
        const image = fileInputRef.current?.files?.[0] || null

        if (content.trim() || image) {
            console.log("content: ", content)
            console.log("image: ", image)
            await createPost(content, image)
            toast.success("Post created successfully!")
            if (textareaRef.current) {
                textareaRef.current.value = ""
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
            setPreview(null)
        } else {
            toast.error("Please add some content or image to your post.")
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 max-w-3xl mx-auto bg-card p-6 rounded-md shadow-sm border"
        >
            <Textarea
                ref={textareaRef}
                placeholder="Share your thoughts..."
                className="w-full p-4 border-none rounded-xl text-base focus:outline-none focus:ring-0"
                rows={3}
            />

            {preview && (
                <div className="relative mt-2">
                    <img
                        src={preview}
                        alt="Preview"
                        className="rounded-lg object-cover w-full h-64"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                            setPreview(null)
                            if (fileInputRef.current)
                                fileInputRef.current.value = ""
                        }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}

            <div className="flex justify-between mt-2 items-center">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        id="post-image"
                        onChange={handleImageChange}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon className="w-4 h-4" />
                        Add Image
                    </Button>
                </div>

                <Button type="submit" size="sm" className="px-6">
                    Post
                </Button>
            </div>
        </form>
    )
}
