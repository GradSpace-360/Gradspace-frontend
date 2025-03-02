import { BsCheck2All } from "react-icons/bs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { axiosPrivate } from "@/config/axiosInstance"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth"

import { useConversationStore } from "./conversationStore"
import { Message as MessageType } from "./types"

interface MessageProps {
    ownMessage: boolean
    message: MessageType
}

const Message = ({ ownMessage, message }: MessageProps) => {
    const { selectedConversation } = useConversationStore()
    const { user: currentUser } = useAuthStore()
    let userProfileImag = ""
    if (currentUser) {
        userProfileImag =
            selectedConversation!.participant1Id === currentUser.id
                ? selectedConversation!.participant2ProfileImg
                : selectedConversation!.participant1ProfileImg
    }
    let userFullName = ""
    if (currentUser) {
        userFullName =
            selectedConversation!.participant1Id === currentUser.id
                ? selectedConversation!.participant2FullName
                : selectedConversation!.participant1FullName
    }

    const currentUserProfileImageUrl = currentUser?.profile_image
    return (
        <div
            className={cn("flex", ownMessage ? "justify-end" : "justify-start")}
        >
            {ownMessage ? (
                <div className="flex gap-2 self-end">
                    <div className="flex max-w-[350px] items-end gap-1 rounded-md bg-gray-300 dark:bg-primary-foreground px-2 py-1">
                        <span className="dark:text-white text-black ">
                            {message.text}
                        </span>
                        <BsCheck2All
                            className={cn(
                                "h-4 w-4 shrink-0",
                                message.seen ? "text-blue-400" : "text-gray-500"
                            )}
                        />
                    </div>
                    <Avatar className="h-7 w-7">
                        <AvatarImage
                            src={`${axiosPrivate.defaults.baseURL}/${currentUserProfileImageUrl}`}
                        />
                        <AvatarFallback>
                            {currentUser?.full_name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Avatar className="h-7 w-7">
                        <AvatarImage
                            src={`${axiosPrivate.defaults.baseURL}/${userProfileImag}`}
                        />
                        <AvatarFallback>{userFullName![0]}</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[350px] rounded-md bg-gray-200 px-2 py-1  dark:bg-gray-900  ">
                        <span className="text-black dark:text-white ">
                            {message.text}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Message
