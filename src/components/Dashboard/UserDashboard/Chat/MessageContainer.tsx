import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { axiosPrivate } from "@/config/axiosInstance"
import { useSocket } from "@/context/SocketContext"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth"

import { useConversationStore } from "./conversationStore"
import Message from "./Message"
import MessageInput from "./MessageInput"
import { Message as MessageType } from "./types"

interface NewMessage {
    id: string
    seen: boolean
    conversationId: string
    senderId: string
    text: string
    createdAt: string
}

const MessageContainer = () => {
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [messages, setMessages] = useState<MessageType[]>([])
    const { setConversations, selectedConversation, setSelectedConversation } =
        useConversationStore()
    const { user: currentUser } = useAuthStore()
    const { socket } = useSocket()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleClearChat = () => {
        // TODO: Implement clear chat functionality
        console.log("Clearing chat...")
    }
    function useClickOutside(
        ref: React.RefObject<HTMLElement>,
        callback: () => void
    ) {
        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (
                    ref.current &&
                    !ref.current.contains(event.target as Node)
                ) {
                    callback()
                }
            }
            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [ref, callback])
    }
    const menuRef = useRef<HTMLDivElement>(null)
    useClickOutside(menuRef, () => setIsMenuOpen(false))

    // identify the user with we are chatting.
    let userId = null
    if (currentUser) {
        userId =
            selectedConversation?.participant1Id === currentUser.id
                ? selectedConversation.participant2Id
                : selectedConversation?.participant1Id
    }
    let userProfileImgUrl = null
    if (currentUser) {
        userProfileImgUrl =
            selectedConversation?.participant1Id === currentUser.id
                ? selectedConversation.participant2ProfileImg
                : selectedConversation?.participant1ProfileImg
    }
    let userFullName = null
    if (currentUser) {
        userFullName =
            selectedConversation?.participant1Id === currentUser.id
                ? selectedConversation.participant2FullName
                : selectedConversation?.participant1FullName
    }
    useEffect(() => {
        if (!socket) return

        const handleMessage = (event: MessageEvent) => {
            console.log("handle message in message container")
            try {
                const data = JSON.parse(event.data)
                if (data.type === "NEW_MESSAGE") {
                    const newMessage: NewMessage = data.message
                    if (
                        selectedConversation?.id === newMessage.conversationId
                    ) {
                        // MessageType has no conversationId property
                        // so create new message object without conversationId
                        const messageWithNoConversationId: MessageType = {
                            id: newMessage.id,
                            seen: newMessage.seen,
                            senderId: newMessage.senderId,
                            text: newMessage.text,
                            createdAt: newMessage.createdAt,
                        }
                        setMessages((prev) => [
                            ...prev,
                            messageWithNoConversationId,
                        ])
                    }

                    // update the conversation last message and last message sender
                    console.log("newMessage", newMessage)

                    setConversations((prev) => {
                        const updatedConversations = prev.map(
                            (conversation) => {
                                if (
                                    conversation.id ===
                                    newMessage.conversationId
                                ) {
                                    return {
                                        ...conversation,
                                        lastMessage: newMessage.text,
                                        lastMessageSenderId:
                                            newMessage.senderId,
                                    }
                                }
                                return conversation
                            }
                        )
                        return updatedConversations
                    })

                    console.log("New message received:", data.message)
                }
            } catch (error) {
                console.error("Error handling message:", error)
            }
        }

        socket.addEventListener("message", handleMessage)
        return () => socket.removeEventListener("message", handleMessage)
    }, [socket, selectedConversation, setConversations])

    // MARK_MESSAGES_AS_SEEN event listener
    useEffect(() => {
        if (!socket) return
        const lastMessageIsFromOtherUser =
            messages[messages.length - 1]?.senderId !== currentUser?.id
        if (lastMessageIsFromOtherUser) {
            socket.send(
                JSON.stringify({
                    type: "MARK_MESSAGES_AS_SEEN",
                    payload: {
                        conversationId: selectedConversation?.id,
                        userId: currentUser?.id,
                    },
                })
            )
        }
        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data)
                if (data.type === "MESSAGES_SEEN") {
                    const conversationId: string = data.conversationId

                    if (selectedConversation?.id === conversationId) {
                        setMessages((prev) => {
                            const updatedMessages = prev.map((message) => {
                                if (!message.seen) {
                                    return {
                                        ...message,
                                        seen: true,
                                    }
                                }
                                return message
                            })

                            return updatedMessages
                        })
                    }
                    // update the conversation last message seen status
                    setConversations((prev) => {
                        const updatedConversations = prev.map(
                            (conversation) => {
                                if (conversation.id === conversationId) {
                                    return {
                                        ...conversation,
                                        lastMessageSeen: true,
                                    }
                                }
                                return conversation
                            }
                        )
                        return updatedConversations
                    })
                }
            } catch (error) {
                console.error("Error handling message:", error)
            }
        }
        socket.addEventListener("message", handleMessage)
        return () => socket.removeEventListener("message", handleMessage)
    }, [socket, messages, currentUser, selectedConversation])

    // useEffect to handle the scroll to bottom of the message container.
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // fetch the conversation based on the selected conversation id .
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoadingMessages(true)
                if (selectedConversation!.mock) {
                    setMessages([])
                    return
                }

                const response = await axiosPrivate.get(`/messages/${userId}`)
                setMessages(response.data.messages)
            } catch {
                toast.error("Failed to fetch messages")
            } finally {
                setLoadingMessages(false)
            }
        }
        fetchMessages()
    }, [userId])

    const messageEndRef = useRef<HTMLDivElement>(null)
    return (
        <div className="flex flex-1 justify-between flex-col  top-0  p-2 border-l-2 z-50 ">
            {/* ----------------------Message header------------------------------------------ */}
            <div className="flex h-14 w-full items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700 dark:bg-primary-foreground bg-white/10 shadow-md rounded-full">
                <div className="flex items-center gap-4">
                    <button
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center hover:bg-gray-200 dark:hover:bg-black/20 rounded-full"
                        onClick={() => setSelectedConversation(null)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-700 dark:text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-white dark:border-gray-800">
                        <AvatarImage
                            src={`${axiosPrivate.defaults.baseURL}/${userProfileImgUrl}`}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-600">
                            {userFullName?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex min-w-0 flex-1 items-center">
                        <h4 className="truncate text-base font-semibold text-gray-900 dark:text-gray-100">
                            {userFullName}
                        </h4>
                    </div>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-black/20 transition-colors"
                        aria-label="More options"
                    >
                        <svg
                            className="h-5 w-5 text-gray-600 dark:text-gray-400"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 16a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4z" />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg dark:bg-primary-foreground  border border-gray-100 dark:border-gray-700">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => {
                                        handleClearChat()
                                        setIsMenuOpen(false)
                                    }}
                                    className="w-full px-3 py-2 text-sm text-left rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    Clear Chat History
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* -----------------------------Message container------------------------------------------ */}
            <div className="my-4 flex flex-col gap-4 overflow-y-auto p-2 h-full">
                {loadingMessages &&
                    [...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex items-center gap-2 rounded-md p-1",
                                i % 2 === 0 ? "self-start" : "self-end"
                            )}
                        >
                            {i % 2 === 0 && (
                                <Skeleton className="h-7 w-7 rounded-full" />
                            )}
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-2 w-64" />
                                <Skeleton className="h-2 w-64" />
                                <Skeleton className="h-2 w-64" />
                            </div>
                            {i % 2 !== 0 && (
                                <Skeleton className="h-7 w-7 rounded-full" />
                            )}
                        </div>
                    ))}

                {!loadingMessages &&
                    messages.map((message, index) => (
                        <div
                            key={message.id}
                            className="flex flex-col"
                            ref={
                                index === messages.length - 1
                                    ? messageEndRef
                                    : null
                            }
                        >
                            <Message
                                message={message}
                                ownMessage={
                                    currentUser!.id === message.senderId
                                }
                            />
                        </div>
                    ))}
            </div>
            <MessageInput
                setMessages={setMessages}
                recipientId={userId as string}
            />
        </div>
    )
}

export default MessageContainer
