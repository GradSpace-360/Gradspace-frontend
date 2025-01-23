/*
    authStore is a global store that stores the user's authentication status.
    It provides methods to sign up, log in, log out, and verify email.
    It also stores the user's data and the access token.

*/

import axios from "axios"
import { create } from "zustand"

import { CustomError } from "@/types/common"

import { AuthStore } from "../../types/auth"
axios.defaults.withCredentials = true // to send cookies with requests
import { axiosPrivate } from "@/config/axiosInstance"

/*
zustand's create function is used to create a store.
It takes a function as an argument and which should return an object. The object returned by the function is the store. that store can be used to store the state of the application and functions to update the state.

the argument set is a function that provided by zustand to update the state of the store, similar to the setState function in react,
but it works for zustand's global state.


useAuthStore is a custom hook that returns the store object created by the create function.
*/

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isCheckingAuth: true,
    message: null,

    signUp: async (user) => {
        set({ isLoading: true, error: null })
        console.log("signup", user)
        try {
            const res = await axiosPrivate.post(`/auth/signup/`, {
                username: user.username,
                email: user.email,
                password: user.password,
            })
            set({
                user: res.data.user,
                isAuthenticated: true,
                isLoading: false,
            })
        } catch (error) {
            const customError = error as CustomError
            set({
                error:
                    customError.response?.data?.message || "Error signing up",
                isLoading: false,
            })
            throw error
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null })
        console.log("verify", code)
        try {
            await axiosPrivate.post(`/auth/verify-email`, {
                code,
            })
            set({
                // redirect to login page after verifying email,
                // dont set isAuthenticated to true here, because the user is not logged in yet
                // the user data is set in the login function, otherwise /login will redirect to /dashboard
                isLoading: false,
            })
        } catch (error) {
            const customError = error as CustomError
            set({
                error:
                    customError.response?.data?.message ||
                    "Error verifying email",
                isLoading: false,
            })
            throw error
        }
    },

    checkAuth: async () => {
        console.log("check auth")
        set({ isCheckingAuth: true, error: null })
        try {
            const res = await axiosPrivate.get(`/auth/check-auth`)
            set({
                user: res.data.user,
                isAuthenticated: true,
                isCheckingAuth: false,
            })
        } catch (error) {
            const customError = error as CustomError
            set({
                error:
                    customError.response?.data?.message ||
                    "Error checking authentication",
            })
            set({ isCheckingAuth: false, error: null, isAuthenticated: false })
        }
    },

    login: async (email, password) => {
        console.log("login", email, password)
        try {
            const res = await axiosPrivate.post(`/auth/login`, {
                email,
                password,
            })
            set({
                isAuthenticated: true,
                user: res.data.user,
                error: null,
                isLoading: false,
            })
        } catch (error) {
            const customError = error as CustomError
            set({
                error:
                    customError.response?.data?.message || "Error logging in",
                isLoading: false,
            })
            throw error
        }
    },

    logout: async () => {
        console.log("logout")
        set({ isLoading: true, error: null })
        try {
            await axiosPrivate.post(`/auth/logout`)
            set({
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
            })
        } catch (error) {
            set({ error: "Error logging out", isLoading: false })
            throw error
        }
    },

    forgotPassword: async (email) => {
        console.log("forgot", email)
        set({ isLoading: true, error: null })
        try {
            const res = await axiosPrivate.post(`/auth/forgot-password`, {
                email,
            })
            set({ message: res.data.message, isLoading: false })
        } catch (error) {
            const customError = error as CustomError
            set({
                isLoading: false,
                error:
                    customError.response?.data?.message ||
                    "Error sending reset password email",
            })
            throw error
        }
    },

    resetPassword: async (token, password) => {
        console.log("reset", token, password)

        set({ isLoading: true, error: null })
        try {
            // a small delay
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const res = await axiosPrivate.post(
                `/auth/reset-password/${token}`,
                {
                    password,
                }
            )
            set({ message: res.data.message, isLoading: false })
        } catch (error) {
            const customError = error as CustomError
            set({
                isLoading: false,
                error:
                    customError.response?.data?.message ||
                    "Error resetting password",
            })
            throw error
        }
    },
    /*
        clearError function
        it clears the error message in the store
        this helps to ensure that the same error message is not shown across different auth pages
    */
    clearError: () => set({ error: null }),
}))
