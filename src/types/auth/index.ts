export interface User {
    id: string // Maps to MongoDB's ObjectId (_id) as a string
    username: string // Matches the 'username' field in the schema
    email: string // Matches the 'email' field in the schema
    password: string // Matches the 'password' field in the schema
    lastLogin: Date // Matches the 'lastLogin' field in the schema
    isVerified: boolean // Matches the 'isVerified' field in the schema
    resetPasswordToken?: string // Optional, matches 'resetPasswordToken'
    resetPasswordExpiresAt?: Date // Optional, matches 'resetPasswordExpiresAt'
    verificationToken?: string // Optional, matches 'verificationToken'
    verificationTokenExpiresAt?: Date // Optional, matches 'verificationTokenExpiresAt'
    createdAt: Date // Added from Mongoose 'timestamps' option
    updatedAt: Date // Added from Mongoose 'timestamps' option
    role: "Admin" | "Student" | "Faculty" | "Alumni" // Matches the 'role' field in the schema
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
        name: string
        email: string
        password: string
    }) => Promise<void>
    verifyEmail: (code: string) => Promise<void>
    checkAuth: () => Promise<void>
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    resetPassword: (token: string, password: string) => Promise<void>
}
