export interface User {
    id: string
    username: string
    email: string
    password: string
    isVerified: boolean
    is_onboard: boolean
    registration_status:
        | "pending"
        | "registered"
        | "rejected"
        | "not_registered"
    resetPasswordToken?: string
    resetPasswordExpiresAt?: Date
    verificationToken?: string
    verificationTokenExpiresAt?: Date
    createdAt: Date
    updatedAt: Date
    role: "Admin" | "Student" | "Faculty" | "Alumni"
    [key: string]: any // For any additional or dynamic user fields
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
    clearError: () => void
}
