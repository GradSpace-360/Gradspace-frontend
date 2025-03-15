export interface Notification {
    id: string
    type: "LIKE" | "COMMENT" | "FOLLOW"
    read: boolean
    createdAt: string
    creator: {
        id: string
        username: string
        image: string
    }
    post?: {
        id: string
        content: string
        image: string
    }
    comment?: {
        id: string
        content: string
    }
}