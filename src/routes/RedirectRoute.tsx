import React, { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { useAuthStore } from "@/store/auth"

// Custom RedirectRoute component
const RedirectRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore()

    return isAuthenticated && user?.isVerified ? (
        <Navigate to="/dashboard" replace />
    ) : (
        <>{children}</>
    )
}

export default RedirectRoute
