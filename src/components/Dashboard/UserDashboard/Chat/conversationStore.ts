import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"

import { Conversation, ConversationState } from "./types"

export const useConversationStore = create<ConversationState>((set) => ({
    conversations: [],
    selectedConversation: null,
    isLoading: false,
    error: null,
    isMobileView: false,
    showConversationList: true,

    fetchConversations: async () => {
        try {
            set({ isLoading: true, error: null })
            const response = await axiosPrivate.get("/messages/conversations")
            set({
                conversations: response.data.conversations,
                isLoading: false,
            })
        } catch (error) {
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch conversations",
                isLoading: false,
            })
        }
    },

    setSelectedConversation: (conversation: Conversation | null) =>
        set({ selectedConversation: conversation }),

    setConversations: (updater) =>
        set((state) => ({
            conversations:
                typeof updater === "function"
                    ? updater(state.conversations)
                    : updater,
        })),
    setIsMobileView: (isMobile) => set({ isMobileView: isMobile }),
    toggleConversationList: () =>
        set((state) => ({ showConversationList: !state.showConversationList })),
}))
