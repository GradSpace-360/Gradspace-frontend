/**
 * AddViewToggle Component
 *
 * A toggle component that allows switching between "View/Update Users" and "Add User" modes.
 * It uses a tab-based interface with a smooth motion animation to indicate the selected mode.
 *
 * @param {Object} props - The component props.
 * @param {(mode: "add" | "view") => void} props.onToggle - Callback function triggered when the mode changes.
 * @param {"add" | "view"} props.mode - The current active mode ("add" or "view").
 *
 * @returns {JSX.Element} - A toggle component with tabs and a motion animation indicator.
 */

import { motion } from "framer-motion"
import React from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const AddViewToggle: React.FC<{
    onToggle: (mode: "add" | "view") => void
    mode: "add" | "view"
}> = ({ onToggle, mode }) => {
    return (
        <div className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20 border-b">
            <div className="flex h-16 items-center justify-center w-full max-w-full px-4">
                <Tabs
                    value={mode}
                    onValueChange={onToggle as (value: string) => void}
                    className="w-full max-w-full"
                >
                    <TabsList className="grid w-full grid-cols-2 gap-1">
                        <TabsTrigger value="view" className="w-full">
                            View/Update Users
                        </TabsTrigger>
                        <TabsTrigger value="add" className="w-full">
                            Add User
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <motion.div
                className="h-[2px] bg-primary"
                initial={false}
                animate={{
                    x: mode === "view" ? "0%" : "95%",
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                style={{
                    width: "50%",
                }}
            />
        </div>
    )
}
