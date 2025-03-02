import { useEffect } from "react"
// Lazy load pages and components to reduce the initial bundle size
import { lazy, Suspense } from "react"
import {  Navigate, Route, Routes, useParams } from "react-router-dom"

import  Notifications  from "@/components/Dashboard/UserDashboard/Notifications"
import { useAuthStore } from "@/store/auth"

import ChatPreview from "./components/Dashboard/UserDashboard/Chat"
import EventsPreview from "./components/Dashboard/UserDashboard/Events"
import Explore from "./components/Dashboard/UserDashboard/Explore"
import HomePreview from "./components/Dashboard/UserDashboard/Home"
import JobPortalPreview from "./components/Dashboard/UserDashboard/Jobs"
import ProfilePreview from "./components/Dashboard/UserDashboard/Profile"
import ProjectShelfPreview from "./components/Dashboard/UserDashboard/ProjectShelf"
import SettingsPreview from "./components/Dashboard/UserDashboard/Settings"
import PreLoader from "./components/PreLoader" 

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
// const RedirectRoute = lazy(() => import("./routes/RedirectRoute"))
const OnboardingPage = lazy(() => import("./pages/Onboard"))
const ManualVerificationPending = lazy(
    () => import("./pages/Registration/ManualVerificationPending")
)
const ManualVerificationRejected = lazy(
    () => import("./pages/Registration/RegistrationRejected")
)
const RegisterRequestPage = lazy(
    () => import("./pages/Registration/RegisterRequest")
)

const ProfilePreviewWrapper = () => {  
    const { userName } = useParams(); // Access the userName from the URL
    return <ProfilePreview userName={userName || ""} />; 
};

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
                        // <RedirectRoute>
                            <HomePage />
                        // </RedirectRoute>
                    }
                />

                {/* wrap the onboard , register-endpoints by ProtectedRoute.*/}
                <Route path="/onboard" element={<OnboardingPage />} />
                <Route
                    path="/register-request"
                    element={
                        // <ProtectedRoute>
                        <RegisterRequestPage />
                        // <ProtectedRoute>
                    }
                />
                <Route
                    path="/register-pending"
                    element={
                        // <ProtectedRoute>
                        <ManualVerificationPending />
                        // </ProtectedRoute>
                    }
                />
                <Route
                    path="/register-rejected"
                    element={
                        // <ProtectedRoute>
                        <ManualVerificationRejected />
                        // </ProtectedRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        // <RedirectRoute>
                            <LoginPage />
                        // </RedirectRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        // <RedirectRoute>
                            <SignupPage />
                        // </RedirectRoute>
                    }
                />
                <Route
                    path="/verify-email"
                    element={
                        // <ProtectedRoute>
                        <EmailVerificationPage />
                        // </ProtectedRoute>
                    }
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
                    >
                    <Route index element={<HomePreview />} />
                    <Route path="job-portal" element={<JobPortalPreview />} />
                    <Route path="explore" element={<Explore />} />
                    <Route path="events" element={<EventsPreview />} />
                    {/* <Route path="chat" element={<ChatPreview />} /> */}
                    <Route path="direct/inbox" element={<ChatPreview />} />
                    <Route path="direct/t/:userId" element={<ChatPreview />} />

                    <Route path="projects" element={<ProjectShelfPreview />} />
                    <Route path="profile/:userName" element={<ProfilePreviewWrapper />} />
                    <Route path="settings" element={<SettingsPreview />} />
                    <Route path="notifications" element={<Notifications />} />
                </Route>

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
