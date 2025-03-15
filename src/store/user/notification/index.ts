import { create } from "zustand"

import { axiosPrivate } from "@/config/axiosInstance"
import { Notification } from "@/types/user/notification"

interface NotificationState {
    notifications: Notification[]
    loading: boolean
    error: string | null
    fetchNotifications: () => Promise<void>
    markAsRead: (notificationIds: string[]) => Promise<void>
}

const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    loading: false,
    error: null,

    fetchNotifications: async () => {
        set({ loading: true, error: null })
        try {
            const response = await axiosPrivate.get("/notifications")
            const notifications = response.data

            const unreadIds = notifications
                .filter((n: Notification) => !n.read)
                .map((n: Notification) => n.id)

            if (unreadIds.length > 0) {
                await axiosPrivate.post("/notifications/read", {
                    notificationIds: unreadIds,
                })
            }
            set({
                notifications: notifications,
                loading: false,
            })
        } catch {
            set({ error: "Failed to fetch notifications", loading: false })
        }
    },

    markAsRead: async (notificationIds) => {
        try {
            await axiosPrivate.post("/notifications/read", { notificationIds })
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    notificationIds.includes(n.id) ? { ...n, read: true } : n
                ),
            }))
        } catch (error) {
            console.error("Failed to mark notifications as read:", error)
        }
    },
}))

export default useNotificationStore
