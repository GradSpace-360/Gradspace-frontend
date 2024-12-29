import React, { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { useAuthStore } from "@/store/auth"

// Custom ProtectedRoute component
const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore()

    const redirectPath = !isAuthenticated
        ? "/login"
        : user && !user.isVerified
          ? "/verify-email"
          : null

    return redirectPath ? (
        <Navigate to={redirectPath} replace />
    ) : (
        <>{children}</>
    )
}

export default ProtectedRoute
