import { Loader2 } from "lucide-react"
import { FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { IoSendSharp } from "react-icons/io5"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { axiosPrivate } from "@/config/axiosInstance"

import { useConversationStore } from "./conversationStore"
import { Message as MessageType } from "./types"
interface MessageInputProps {
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
    recipientId: string
}

const MessageInput = ({ setMessages, recipientId }: MessageInputProps) => {
    const [messageText, setMessageText] = useState("")
    const { selectedConversation, setConversations } = useConversationStore()
    const [isSending, setIsSending] = useState(false)

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault()
        if (!messageText.trim()) return
        if (isSending) return

        setIsSending(true)

        try {
            console.log("sending message :", messageText)
            const res = await axiosPrivate.post<MessageType>("/messages", {
                content: messageText,
                recipientId: recipientId,
            })
            console.log("response from sending message :", res)
            const data = res.data

            if (!res) {
                throw new Error("Failed to send message")
            }

            setMessages((prev) => (Array.isArray(prev) ? [...prev, data] : [data]));

            setConversations((prevConvs) =>
                prevConvs.map((conv) =>
                    conv.id === selectedConversation?.id
                        ? {
                              ...conv,
                              lastMessage: data.text,
                              lastMessageSenderId: data.senderId,
                              lastMessageSeen: false,
                          }
                        : conv
                )
            )

            setMessageText("")
        } catch {
            toast.error("Failed to send message")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="flex items-center gap-2 p-2">
            <form onSubmit={handleSendMessage} className="flex-1">
                <div className="relative flex gap-2">
                    <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message ..."
                        className="pr-16 rounded-full"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-0 top-0 h-full rounded-l-none rounded-full"
                        disabled={isSending}
                    >
                        {isSending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <IoSendSharp className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default MessageInput
