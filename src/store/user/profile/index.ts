import toast from "react-hot-toast"
import { create } from "zustand"

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
            const response = await axiosPrivate.get(`/profile/${userName}`)
            const data: ProfileData = response.data
            set({ profileData: data, loading: false })
        } catch (error) {
            console.log("Error fetching user profile:", error)
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

            // handling profile image update separately, TODO : later extract this from the updateProfile function,
            // and create a new function for updating the profile image.
            const formDataProfile = new FormData()
            if (profileImage === null) {
                // Indicate removal of profile image
                formDataProfile.append("profile_image", "null")
            } else if (typeof profileImage === "string") {
                // No change; send current image path
                formDataProfile.append("profile_image", profileImage)
            } else {
                // New binary file provided; ensure profileImage is a Blob with a filename
                console.log("add profile image (binary)", profileImage)
                const blob =
                    profileImage instanceof Blob
                        ? profileImage
                        : new Blob(
                              profileImage !== undefined ? [profileImage] : []
                          )
                // Provide a filename (e.g., "upload.png")
                formDataProfile.append("profile_image", blob, "upload.png")
            }
            try {
                await axiosPrivate.patch(
                    "/profile/profileImage",
                    formDataProfile,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                )
            } catch (error) {
                console.error("Error updating profile image:", error)
            }
            // handling profile data update separately (excluded profile image)
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
                await useProfileStore.getState().fetchProfile(userName)
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
