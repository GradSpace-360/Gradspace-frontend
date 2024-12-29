import { useEffect } from "react"
// Lazy load pages and components to reduce the initial bundle size
import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import { useAuthStore } from "@/store/auth"

import PreLoader from "./components/PreLoader" // PreLoader imported normally, not lazy-loaded

// Lazy-loaded components/pages
const EmailVerificationPage = lazy(
    () => import("./pages/Auth/EmailVerification")
)
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPassword"))
const LoginPage = lazy(() => import("./pages/Auth/Login"))
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPassword"))
const SignupPage = lazy(() => import("./pages/Auth/SignUp"))
const DashboardPage = lazy(() => import("./pages/Dashboard"))
const DevInfo = lazy(() => import("./pages/DevInfo"))
const HomePage = lazy(() => import("./pages/Home"))
const PageNotFound = lazy(() => import("./pages/PageNotFound"))
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"))
const RedirectRoute = lazy(() => import("./routes/RedirectRoute"))

const App = () => {
    const { isCheckingAuth, checkAuth, user } = useAuthStore()

    useEffect(() => {
        checkAuth() // Check if the user is authenticated
    }, [checkAuth])

    // Show PreLoader while authentication check is in progress
    if (isCheckingAuth) {
        return <PreLoader />
    }

    return (
        <Suspense fallback={<PreLoader />}>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RedirectRoute>
                            <HomePage />
                        </RedirectRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <RedirectRoute>
                            <LoginPage />
                        </RedirectRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectRoute>
                            <SignupPage />
                        </RedirectRoute>
                    }
                />
                <Route
                    path="/verify-email"
                    element={<EmailVerificationPage />}
                />
                <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            {user ? (
                                <DashboardPage userRole={user.role} />
                            ) : (
                                <Navigate to="/login" replace />
                            )}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                />
                <Route path="/devinfo" element={<DevInfo />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Suspense>
    )
}

export default App
