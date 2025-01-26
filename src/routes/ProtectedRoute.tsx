import React, { ReactNode } from "react"
import { Navigate } from "react-router-dom"

import { useAuthStore } from "@/store/auth"
interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore()

    // Determine the redirect path based on user state
    let redirectPath: string | null = null
    if (!isAuthenticated) {
        redirectPath = "/login"
    } else if (!user?.is_verified) {
        redirectPath = "/verify-email"
    } else {
        switch (user?.registration_status) {
            case "pending":
                redirectPath = "/register-pending"
                break
            case "not_registered":
                redirectPath = "/register-request"
                break
            case "rejected":
                redirectPath = "/register-rejected"
                break
            default:
                if (!user?.is_onboard) {
                    redirectPath = "/onboard"
                }
                break
        }
    }

    if (redirectPath) {
        return <Navigate to={redirectPath} replace />
    }

    // If no redirection is needed, render the children
    return <>{children}</>
}

export default ProtectedRoute
