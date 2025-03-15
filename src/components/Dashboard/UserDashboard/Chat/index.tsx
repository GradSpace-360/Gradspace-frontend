import { DialogDescription } from "@radix-ui/react-dialog"
import { SquarePenIcon } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { axiosPrivate } from "@/config/axiosInstance"
import { useSocket } from "@/context/SocketContext"
import useDebounce from "@/hooks/useDebounce"
import { useAuthStore } from "@/store/auth"

import Conversation from "./Conversation"
import { useConversationStore } from "./conversationStore"
import { EmptyState } from "./EmptyState"
import MessageContainer from "./MessageContainer"
import { Conversation as ConversationType } from "./types"

interface UserResult {
    recipientId: string
    recipientFullName: string
    recipientProfileImg: string
}

interface NewMessage {
    id: string
    seen: boolean
    conversationId: string
    senderId: string
    text: string
    createdAt: string
}

const ChatPage = () => {
    const {
        conversations,
        isLoading: loadingConversation,
        error,
        fetchConversations,
        selectedConversation,
        setSelectedConversation,
        setConversations,
    } = useConversationStore()
    const { user } = useAuthStore()
    const [searchText, setSearchText] = useState("")
    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)

    const [users, setUsers] = useState<UserResult[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const debouncedSearch = useDebounce(searchText, 500)
    const { socket, onlineUsers } = useSocket()
    const fetchUsers = async (reset = false) => {
        try {
            setIsLoading(true)
            const url = debouncedSearch
                ? `/messages/search/${encodeURIComponent(debouncedSearch)}?page=${reset ? 1 : page}`
                : `/messages/suggested/users?page=${reset ? 1 : page}`

            const response = await axiosPrivate.get(url)
            const data = response.data
            const results = data.recipents || data.users || []
            const newHasMore = data.meta?.current_page < data.meta?.total_pages

            if (reset) {
                setUsers(results)
                setHasMore(newHasMore)
                setPage(1)
            } else {
                setUsers((prev) => [...prev, ...results])
                setHasMore(newHasMore)
            }
        } catch {
            toast.error("Failed to fetch users")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!socket) return

        const handleMessage = (event: MessageEvent) => {
            console.log("handle message in message container")
            try {
                const data = JSON.parse(event.data)
                if (data.type === "NEW_MESSAGE") {
                    const newMessage: NewMessage = data.message
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

    useEffect(() => {
        fetchConversations()
    }, [fetchConversations])

    // Handle initial load and search changes
    useEffect(() => {
        if (dialogOpen) {
            setHasMore(true)
            fetchUsers(true)
        }
    }, [dialogOpen, debouncedSearch])

    // Handle pagination
    useEffect(() => {
        if (page > 1 && hasMore) {
            fetchUsers(false)
        }
    }, [page])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        if (
            scrollHeight - scrollTop <= clientHeight * 1.2 &&
            !isLoading &&
            hasMore
        ) {
            setPage((prev) => prev + 1)
        }
    }

    const handleUserSelect = (userId: string) => {
        setSelectedUser((prev) => (prev === userId ? null : userId))
    }

    const startNewChat = async () => {
        if (!selectedUser) return
        try {
            // handling new chat creation
            const messagingYourself = selectedUser === user!.id
            if (messagingYourself) {
                toast.error("You cannot message yourself")
                return
            }

            console.log("conversations : ", conversations)

            // if loading conversation is true, then wait for the conversation to load , after only proceed the below code of startNewChart
            const conversationAlreadyExists = conversations.find(
                (conv) =>
                    conv.participant1Id === selectedUser ||
                    conv.participant2Id === selectedUser
            )
            // Common cleanup actions
            const cleanup = () => {
                setDialogOpen(false)
                setSearchText("")
                setSelectedUser(null)
                setUsers([])
                setHasMore(true)
            }

            if (conversationAlreadyExists) {
                setSelectedConversation(conversationAlreadyExists)
                cleanup()
                return
            }

            const mockConversation: ConversationType = {
                mock: true,
                lastMessage: "",
                lastMessageSenderId: "",
                lastMessageSeen: false,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                participant1Id: user!.id,
                participant1FullName: user!.username,
                participant1ProfileImg: user!.profile_image as string,
                participant2Id: selectedUser,
                participant2FullName: users.find(
                    (user) => user.recipientId === selectedUser
                )!.recipientFullName,
                participant2ProfileImg: users.find(
                    (user) => user.recipientId === selectedUser
                )!.recipientProfileImg,
            }
            console.log("above setDialogOpen")
            console.log("dialogOpen : ", dialogOpen)
            setConversations((prevConvs) => [mockConversation, ...prevConvs])
            setSelectedConversation(mockConversation)
            cleanup()
        } catch {
            toast.error("Failed to start conversation")
        }
    }
    // TODO: Add a new chat when a message option is selected from the profile
    // issue: below code is not working as expected,
    // need to find the best logic to start a new chat when a message option is selected from the profile.
    // note: dont remove the current flow of starting a new chat from the dialog.
    // dont change the store logic, just add a new logic to start a new chat when a message option is selected from the profile.

    // this useEffect will start a new chat when a message option is selected from the profile.
    // ensure conversations are loaded before starting a new chat, else the conversation will not be added to the list.
    // useEffect(() => {
    //     if (selectedUser && !loadingConversation) {
    //         startNewChat()
    //     }
    // }, [selectedUser, loadingConversation])

    return (
        <div>
            <div className="flex h-screen ">
                {/* chat container */}

                <div
                    className={`${selectedConversation ? "hidden" : "flex w-full xm:w-[30vw]"} xm:flex  flex-col w-[30vw]`}
                >
                    <div className="flex justify-between items-center p-4 pt-5 border-b-2 border-gray-300  dark:border-primary-foreground">
                        <p className="text-left font-philosopher">
                            {user?.username}
                        </p>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-none bg-transparent"
                                >
                                    <SquarePenIcon />
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                className="flex flex-col justify-between px-0 pt-3 sm:max-w-[520px] pb-2 h-full sm:h-[450px]"
                                aria-describedby="new-chat-dialog"
                            >
                                <DialogHeader className="pb-0">
                                    <DialogTitle className="text-center font-medium text-md pb-2 border-b-2 border-primary-foreground">
                                        New messages
                                    </DialogTitle>
                                    <DialogDescription />
                                    <DialogTitle className="flex font-medium text-md pl-2 pb-0 border-b-2 border-primary-foreground">
                                        To:
                                        <input
                                            type="text"
                                            placeholder="Search...."
                                            value={searchText}
                                            onChange={(e) => {
                                                setSearchText(e.target.value)
                                                setPage(1)
                                                setHasMore(true)
                                            }}
                                            className="bg-transparent pl-3 font-light border-none hover:border-none focus:border-none outline-none"
                                        />
                                    </DialogTitle>
                                </DialogHeader>

                                <div
                                    className="flex flex-col gap-4 py-1 h-full overflow-y-auto"
                                    onScroll={handleScroll}
                                >
                                    {isLoading ? (
                                        [0, 1, 2, 3, 4, 5].map((_, i) => (
                                            <div
                                                key={i}
                                                className="flex gap-4 items-center p-3 animate-pulse"
                                            >
                                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-primary-foreground" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-primary-foreground" />
                                                    <div className="h-2 w-1/2 rounded bg-slate-200 dark:bg-primary-foreground" />
                                                </div>
                                            </div>
                                        ))
                                    ) : users.length > 0 ? (
                                        <>
                                            {!debouncedSearch && (
                                                <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                    Suggested
                                                </h3>
                                            )}
                                            {users.map((user) => (
                                                <div
                                                    key={user.recipientId}
                                                    className="flex items-center p-3 dark:hover:bg-primary-foreground hover:bg-gray-200 cursor-pointer"
                                                    onClick={() =>
                                                        handleUserSelect(
                                                            user.recipientId
                                                        )
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            user.recipientProfileImg
                                                                ? `${axiosPrivate.defaults.baseURL}/${user.recipientProfileImg}`
                                                                : "/user_avatar.png"
                                                        }
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "/user_avatar.png"
                                                        }}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        alt={
                                                            user.recipientFullName
                                                        }
                                                    />
                                                    <div className="ml-3 flex-1">
                                                        <p className="font-medium">
                                                            {
                                                                user.recipientFullName
                                                            }
                                                        </p>
                                                    </div>
                                                    {selectedUser ===
                                                        user.recipientId && (
                                                        <div className="h-4 w-4 rounded-full bg-green-900 flex items-center justify-center">
                                                            <div className="h-3 w-3 rounded-full bg-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}{" "}
                                        </>
                                    ) : (
                                        <p className="text-center text-gray-500 p-4">
                                            {debouncedSearch
                                                ? "No users found"
                                                : "Start typing to search users"}
                                        </p>
                                    )}
                                </div>

                                <DialogFooter className="w-full mb-0 pb-2 p-3 sm:p-0 sm:pb-0 h-10 flex justify-center items-center">
                                    <Button
                                        type="submit"
                                        className="w-full mx-2 mb-0 rounded-md"
                                        onClick={startNewChat}
                                        disabled={!selectedUser}
                                    >
                                        Chat
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <h5 className="p-2">Messages</h5>

                    {loadingConversation &&
                        [0, 1, 2, 3, 4].map((_, i) => (
                            <div
                                key={i}
                                className="w-full p-2 flex items-center space-x-3 rounded-lg"
                            >
                                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                                    <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
                                </div>
                            </div>
                        ))}

                    {!loadingConversation &&
                        conversations.map((conversation) => (
                            <Conversation
                                key={conversation.id}
                                conversation={conversation}
                                isOnline={onlineUsers.includes(
                                    conversation.participant1Id === user!.id
                                        ? conversation.participant2Id
                                        : conversation.participant1Id
                                )}
                            />
                        ))}
                    {error && toast.error("Failed to fetch conversations")}
                </div>
                {selectedConversation && !loadingConversation ? (
                    <MessageContainer />
                ) : (
                    <div
                        className={`${selectedConversation && ""}  hidden xm:flex border-l-2 w-full h-screen  items-center justify-center`}
                    >
                        <EmptyState onStartChat={() => setDialogOpen(true)} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPage
