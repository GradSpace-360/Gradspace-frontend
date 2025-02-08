/**
 * UserManagementPage Component
 *
 * A page component for managing users, allowing switching between "Add User" and "View/Update Users" modes.
 * It uses the `AddViewToggle` component to toggle between the two modes and conditionally renders
 * either the `AddUser` or `ViewUpdate` component based on the selected mode.
 *
 * @returns {JSX.Element} - A user management page with a toggleable interface for adding or viewing/updating users.
 */

import React, { useState } from "react"

import AddUser from "@/components/Dashboard/AdminDashboard/UserManagement/AddUsers"

import { AddViewToggle } from "./AddViewToggle"
import ViewUpdate from "./ViewUpdateUsers"

export const UserManagementPage: React.FC = () => {
    const [mode, setMode] = useState<"add" | "view">("add")

    return (
        <div className="w-full p-1 pt-5 md:pt-0">
            <AddViewToggle onToggle={setMode} mode={mode} />
            <div className="mt-5">
                {mode === "add" ? <AddUser /> : <ViewUpdate />}
            </div>
        </div>
    )
}
