import "./index.css"

import { createRoot } from "react-dom/client"
import { Toaster } from "react-hot-toast"
import { BrowserRouter } from "react-router-dom"

import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <App />
        <Toaster
            toastOptions={{
                style: {
                    padding: "7px",
                    border: "2px solid #E1C6E6",
                    zIndex: 9999,
                },
            }}
        />
    </BrowserRouter>
)
