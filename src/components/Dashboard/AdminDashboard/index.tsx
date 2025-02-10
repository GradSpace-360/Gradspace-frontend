import React, { useEffect, useState } from "react"

import AnalyticsDashboardPage from "./Analytics"
import EventModerationPage from "./EventModeration"
import JobManagementPage from "./JobManagement"
import PostModerationPage from "./PostModeration"
import { RequestManagementPage } from "./RequestManagement"
import { AdminSidebar } from "./SideBar"
import { UserManagementPage } from "./UserManagement"
const AdminDashboard: React.FC = () => {
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

    useEffect(() => {
        const savedFeature = localStorage.getItem("selectedFeature")
        if (savedFeature) {
            setSelectedFeature(savedFeature)
        } else {
            setSelectedFeature("users")
        }
    }, [])

    useEffect(() => {
        if (selectedFeature) {
            localStorage.setItem("selectedFeature", selectedFeature)
        }
    }, [selectedFeature])

    const renderPage = () => {
        switch (selectedFeature) {
            case "users":
                return <UserManagementPage />
            case "requests":
                return <RequestManagementPage />
            case "analytics":
                return <AnalyticsDashboardPage />
            case "jobs":
                return <JobManagementPage />
            case "events":
                return <EventModerationPage />
            case "post":
                return <PostModerationPage />
            default:
                return (
                    <>
                        <h2 className="text-2xl font-bold">
                            Welcome to GradSpace Admin Dashboard
                        </h2>
                        <p className="mt-2">
                            Select a menu item to get started.
                        </p>
                    </>
                )
        }
    }

    return (
        <div className="flex h-screen">
            <AdminSidebar
                selectedFeature={selectedFeature}
                setSelectedFeature={setSelectedFeature}
            />
            <div className="flex-1 overflow-auto">
                <main className="flex-1 md:p-0 pt-10 ">
                    {selectedFeature && renderPage()}
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard
