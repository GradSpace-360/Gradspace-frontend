import { FC } from "react"
import { BsCheck2All } from "react-icons/bs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosPrivate } from "@/config/axiosInstance"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth"

import { useConversationStore } from "./conversationStore"
import { Conversation as ConversationType } from "./types"

const Conversation: FC<{
    conversation: ConversationType
    isOnline: boolean
}> = ({ conversation, isOnline }) => {
    const { user: currentUser } = useAuthStore()
    const { selectedConversation, setSelectedConversation } =
        useConversationStore()

    let userProfileImag = ""
    if (currentUser) {
        userProfileImag =
            conversation.participant1Id === currentUser.id
                ? conversation.participant2ProfileImg
                : conversation.participant1ProfileImg
    }
    let userFullName = ""
    if (currentUser) {
        userFullName =
            conversation.participant1Id === currentUser.id
                ? conversation.participant2FullName
                : conversation.participant1FullName
    }

    return (
        <div
            className={cn(
                "flex gap-3 items-center p-3 sm:p-2 mx-1 sm:mx-2 rounded-xl sm:rounded-l-full",
                "hover:cursor-pointer hover:bg-primary-foreground dark:hover:bg-primary-foreground hover:bg-gray-200",
                "active:scale-95 transition-all duration-150",
                "mb-2 sm:mb-1",
                selectedConversation?.id === conversation.id &&
                    "bg-gray-200 dark:bg-primary-foreground"
            )}
            onClick={() => {
                setSelectedConversation(conversation)
            }}
        >
            <div className="relative flex-shrink-0">
                <Avatar className="h-12 w-12 sm:h-10 sm:w-10 md:h-12 md:w-12">
                    {" "}
                    <AvatarImage
                        src={`${axiosPrivate.defaults.baseURL}/${userProfileImag}`}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                        {userFullName[0]}
                    </AvatarFallback>
                </Avatar>
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-[3px] border-white dark:border-gray-950" />
                )}
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
                {" "}
                <div className="flex items-center">
                    <span className="truncate text-base sm:text-sm font-semibold">
                        {" "}
                        {userFullName}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm sm:text-xs text-gray-600 dark:text-gray-400">
                    {currentUser?.id === conversation.lastMessageSenderId && (
                        <BsCheck2All
                            className={cn(
                                "w-5 h-5 sm:w-4 sm:h-4",
                                conversation.lastMessageSeen && "text-blue-500"
                            )}
                        />
                    )}
                    <span className="truncate">
                        {conversation.lastMessage.length > 25
                            ? conversation.lastMessage.substring(0, 25) + "..."
                            : conversation.lastMessage}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Conversation
