import "./index.css"

import { createRoot } from "react-dom/client"
import { Toaster } from "react-hot-toast"
import { BrowserRouter } from "react-router-dom"

import { SocketContextProvider } from "@/context/SocketContext.tsx"

import App from "./App.tsx"
import { ThemeProvider } from "./context/ThemProvider.tsx"

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ThemeProvider>
            <SocketContextProvider>
                <App />
            </SocketContextProvider>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: {
                        padding: "7px",
                        border: "2px solid #E1C6E6",
                        zIndex: 9999,
                    },
                }}
            />
        </ThemeProvider>
    </BrowserRouter>
)
