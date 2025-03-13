// import { createContext, useContext, useEffect, useRef, useState } from "react"

// import { useAuthStore } from "@/store/auth"
// interface SocketContextValue {
//     socket: WebSocket | null
//     onlineUsers: string[]
// }
// import { Message as MessageType } from "@/components/Dashboard/UserDashboard/Chat3/chatType"
// const SocketContext = createContext<SocketContextValue>({
//     socket: null,
//     onlineUsers: [],
// })

// export const useSocket = () => useContext(SocketContext)

// export const SocketContextProvider = ({
//     children,
// }: {
//     children: React.ReactNode
// }) => {
//     const [socket, setSocket] = useState<WebSocket | null>(null)
//     const [onlineUsers, setOnlineUsers] = useState<string[]>([])
//     const [newMessage, setNewMessage] = useState<MessageType>()
//     const user = useAuthStore((state) => state.user)
//     /*
//     WebSocket Event Handlers:
//     onopen → Fires when the connection is established.
//     onmessage → Fires when the client receives a message from the server.
//     onerror → Fires when there's an error in the WebSocket connection.
//     onclose → Fires when the connection is closed
//     */
//     const reconnect = useRef({ attempts: 0, timeout: 5000, maxAttempts: 5 })
//     const isMounted = useRef(true)
//     useEffect(() => {
//         if (!user?.id) return

//         let ws: WebSocket | null = null

//         const connectSocket = () => {
//             const protocol =
//                 window.location.protocol === "https:" ? "wss:" : "ws:"
//             const wsUrl = `${protocol}//localhost:8003/ws?userId=${user.id}`
//             ws = new WebSocket(wsUrl)

//             // Connection established
//             ws.onopen = () => {
//                 if (!isMounted.current) return
//                 console.log("✅ WebSocket connected")
//                 reconnect.current.attempts = 0
//                 reconnect.current.timeout = 5000
//                 setSocket(ws)
//             }
//             // Message handling
//             ws.onmessage = (event) => {
//                 if (!isMounted.current) return
//                 handleWebSocketMessage(event)
//             }
//             // Connection closed
//             ws.onclose = (event) => {
//                 if (!isMounted.current) return
//                 console.warn(`⚠️ WebSocket disconnected (Code: ${event.code})`)
//                 setSocket(null)
//                 scheduleReconnection()
//             }
//             // Error handling
//             ws.onerror = (error) => {
//                 if (!isMounted.current) return
//                 console.error("❌ WebSocket Error:", error)
//                 ws?.close() // Force close connection on error
//             }
//         }

//         const handleWebSocketMessage = (event: MessageEvent) => {
//             try {
//                 const data = JSON.parse(event.data)

//                 if (!data.type) {
//                     console.warn("Unstructured message:", data)
//                     return
//                 }

//                 switch (data.type) {
//                     case "ONLINE_USERS":
//                         setOnlineUsers(data.users)
//                         break
//                     case "NEW_MESSAGE":
//                         setNewMessage(data.message)
//                         break
//                     case "NOTIFICATION":
//                         // showNotification(data.notification)
//                         break
//                     default:
//                         console.warn("Unhandled message type:", data.type)
//                 }
//             } catch (error) {
//                 console.error("Message parsing error:", error)
//             }
//         }

//         const scheduleReconnection = () => {
//             if (reconnect.current.attempts >= reconnect.current.maxAttempts) {
//                 console.error("❌ Max reconnection attempts reached")
//                 return
//             }

//             const nextTimeout = Math.min(
//                 reconnect.current.timeout * 2,
//                 30000 // Max 30 seconds between attempts
//             )

//             console.log(`🔄 Reconnecting in ${nextTimeout / 1000} seconds...`)

//             setTimeout(() => {
//                 if (isMounted.current) connectSocket()
//             }, nextTimeout)

//             reconnect.current.attempts += 1
//             reconnect.current.timeout = nextTimeout
//         }

//         connectSocket()

//         return () => {
//             isMounted.current = false
//             ws?.close(1000, "Component unmounted") // Proper closure code
//         }
//     }, [user?.id])

//     useEffect(() => {
//         console.log("New message:", newMessage)
//     }, [newMessage])

//     useEffect(() => {
//         console.log("Online users updated:", onlineUsers)
//     }, [onlineUsers])
//     return (
//         <SocketContext.Provider value={{ socket, onlineUsers }}>
//             {children}
//         </SocketContext.Provider>
//     )
// }
/**
cleaner architecture

Separation of Concerns: Connection management stays in the context, message handling moves to components
No Prop Drilling: Avoid passing newMessage state through context and effects
Dynamic Handling: Different conversations can handle their own messages without global state 
*/
import { createContext, useContext, useEffect, useRef, useState } from "react"

import { useAuthStore } from "@/store/auth"

interface SocketContextValue {
    socket: WebSocket | null
    onlineUsers: string[]
}

const SocketContext = createContext<SocketContextValue>({
    socket: null,
    onlineUsers: [],
})

export const useSocket = () => useContext(SocketContext)

export const SocketContextProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [onlineUsers, setOnlineUsers] = useState<string[]>([])
    const user = useAuthStore((state) => state.user)

    const reconnect = useRef({
        attempts: 0,
        timeout: 5000,
        maxAttempts: 5,
    })
    const isMounted = useRef(true)

    useEffect(() => {
        if (!user?.id) return

        let ws: WebSocket | null = null

        const connectSocket = () => {
            const protocol =
                window.location.protocol === "https:" ? "wss:" : "ws:"
            const baseUrl =
                window.location.protocol === "https:"
                    ? "api.gradspace.me"
                    : "localhost:8003"
            const wsUrl = `${protocol}//${baseUrl}/ws?userId=${user.id}`
            ws = new WebSocket(wsUrl)

            // Event handlers using addEventListener
            ws.addEventListener("open", handleOpen)
            ws.addEventListener("message", handleMessage)
            ws.addEventListener("close", handleClose)
            ws.addEventListener("error", handleError)
        }

        const handleOpen = () => {
            if (!isMounted.current) return
            console.log("✅ WebSocket connected")
            reconnect.current.attempts = 0
            reconnect.current.timeout = 5000
            setSocket(ws)
        }

        const handleMessage = (event: MessageEvent) => {
            if (!isMounted.current) return
            try {
                const data = JSON.parse(event.data)

                if (!data.type) {
                    console.warn("Unstructured message:", data)
                    return
                }
                switch (data.type) {
                    case "ONLINE_USERS":
                        setOnlineUsers(data.users)
                        break
                    // case "NOTIFICATION":
                    //     // showNotification(data.notification)
                    //     break
                    default:
                        console.warn("Unhandled message type:", data.type)
                }
            } catch (error) {
                console.error("Message parsing error:", error)
            }
        }

        const handleClose = (event: CloseEvent) => {
            if (!isMounted.current) return
            console.warn(`⚠️ WebSocket disconnected (Code: ${event.code})`)
            setSocket(null)
            scheduleReconnection()
        }

        const handleError = (error: Event) => {
            if (!isMounted.current) return
            console.error("❌ WebSocket Error:", error)
            ws?.close()
        }

        const scheduleReconnection = () => {
            if (reconnect.current.attempts >= reconnect.current.maxAttempts) {
                console.error("❌ Max reconnection attempts reached")
                return
            }

            const nextTimeout = Math.min(
                reconnect.current.timeout * 2,
                30000 // Max 30 seconds between attempts
            )

            console.log(`🔄 Reconnecting in ${nextTimeout / 1000} seconds...`)

            setTimeout(() => {
                if (isMounted.current) connectSocket()
            }, nextTimeout)

            reconnect.current.attempts += 1
            reconnect.current.timeout = nextTimeout
        }

        connectSocket()

        return () => {
            isMounted.current = false
            ws?.removeEventListener("open", handleOpen)
            ws?.removeEventListener("message", handleMessage)
            ws?.removeEventListener("close", handleClose)
            ws?.removeEventListener("error", handleError)
            ws?.close(1000, "Component unmounted")
        }
    }, [user?.id])

    useEffect(() => {
        console.log("Online users updated:", onlineUsers)
    }, [onlineUsers])

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}
