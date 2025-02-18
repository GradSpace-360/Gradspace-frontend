import toast from "react-hot-toast"
import { create } from "zustand"

import { fetchUserProfile } from "@/components/Dashboard/UserDashboard/Profile/api"
import { axiosPrivate } from "@/config/axiosInstance"
import { ProfileData } from "@/types/user/Profile"

interface ProfileStore {
    profileData: ProfileData | null
    loading: boolean
    error: string | null
    fetchProfile: (userId: string) => Promise<void>
    clearProfile: () => void
    updateProfile: (
        userName: string,
        updatedData: Partial<ProfileData>
    ) => Promise<void>
}

export const useProfileStore = create<ProfileStore>((set) => ({
    profileData: null,
    loading: false,
    error: null,

    fetchProfile: async (userName) => {
        set({ loading: true, error: null })
        try {
            const data = await fetchUserProfile(userName)
            set({ profileData: data, loading: false })
        } catch {
            set({ error: "Failed to load profile", loading: false })
        }
    },

    clearProfile: () => set({ profileData: null, error: null }),

    updateProfile: async (userName, updatedData) => {
        try {
            const formData = new FormData()

            // Exclude the user field from updatedData
            const { user, profile, ...restData } = updatedData
            console.log(user)
            // create a new profile object with the profile image removed
            const { profileImage, ...profileWithoutImage } = profile || {}
            console.log(profileImage)
            // remove profile image from the profile object
            const dataToSend = {
                ...restData,
                profile: profileWithoutImage,
            }

            // Append JSON data
            formData.append("data", JSON.stringify(dataToSend))
            try {
                await axiosPrivate.patch(`/profile/${userName}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                toast.success("Profile updated successfully")
                // refetch the profile data
                await fetchUserProfile(userName)
                // move to the proifle page
                window.location.href = `/dashboard/profile/${userName}`

            } catch (error) {
                console.log("Error updating user profile:", error)
                toast.error("Failed to update profile")
                throw error
            }
        } catch (error) {
            set({ error: "Failed to update profile" })
            throw error
        }
    },
}))
