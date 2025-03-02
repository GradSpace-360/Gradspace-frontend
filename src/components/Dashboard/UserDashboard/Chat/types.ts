export interface Conversation {
    mock: boolean
    id: string
    createdAt: string
    updatedAt: string
    participant1Id: string
    participant1FullName: string
    participant1ProfileImg: string
    participant2Id: string
    participant2FullName: string
    participant2ProfileImg: string
    lastMessage: string
    lastMessageSenderId: string
    lastMessageSeen: boolean
}
export interface Recipient {
    recipientId: string
    recipientFullName: string
    recipientProfileImg: string
}

export interface Message {
    id: string
    seen: boolean
    senderId: string
    text: string
    createdAt: string
}

export interface ConversationState {
    conversations: Conversation[]
    isLoading: boolean
    error: string | null
    selectedConversation: Conversation | null
    isMobileView: boolean
    showConversationList: boolean

    fetchConversations: () => Promise<void>
    setSelectedConversation: (conversation: Conversation | null) => void
    setConversations: (
        updater: Conversation[] | ((prev: Conversation[]) => Conversation[])
    ) => void
    setIsMobileView: (isMobile: boolean) => void
    toggleConversationList: () => void
}
