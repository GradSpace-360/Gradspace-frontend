export interface CustomError extends Error {
    response?: {
        data?: {
            message?: string
        }
    }
}
