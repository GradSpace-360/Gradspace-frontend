export interface User {
    id: string
    username: string
    email: string
    is_verified: boolean
    is_onboard: boolean
    registration_status:
        | "pending"
        | "registered"
        | "rejected"
        | "not_registered"
    created_at: Date
    updated_at: Date
    role: "Admin" | "Student" | "Faculty" | "Alumni"
    full_name: string
    department: string
    batch: string
    // [key: string]: any // For any additional or dynamic user fields
}

export interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    isCheckingAuth: boolean
    message: string | null
    signUp: (user: {
        username: string
        email: string
        password: string
    }) => Promise<void>
    verifyEmail: (code: string) => Promise<void>
    checkAuth: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (token: string, password: string) => Promise<void>
    sendVerificationOtp: () => Promise<void>
    clearError: () => void
}
