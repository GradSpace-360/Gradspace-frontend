/**
 * UserDistributionChart Component
 *
 * This component renders a pie chart displaying user distribution by role.
 * It visualizes the number of users across different roles, providing insights into the
 * composition of the user base.
 *
 * Props:
 * - data: An array of objects containing user roles and their corresponding counts.
 *   Each object has the following shape:
 *   {
 *     role: string;
 *     count: number;
 *   }
 * - selectedTheme: A key from the colorThemes object to apply theming to the chart.
 * - isLoading: A boolean indicating whether the chart data is currently loading.
 *
 * Features:
 * - Responsive design to adapt to various screen sizes.
 * - Custom tooltip for enhanced data insight.
 * - Legend to differentiate between user roles.
 * - Loading skeleton displayed while data is being fetched.
 */
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

import { ChartLoadingSkeleton } from "@/skeletons"

import { colorThemes } from "../ColorThemes"
import { CustomTooltip } from "./CustomTooltip"
export const UserDistributionChart = ({
    data,
    selectedTheme,
    isLoading,
}: {
    data: { Role: string; Count: number }[]
    selectedTheme: keyof typeof colorThemes
    isLoading: boolean
}) => {
    if (isLoading) {
        return <ChartLoadingSkeleton />
    }

    // Filter out data to include only Student, Alumni, and Faculty roles.
    const allowedRoles = ["Student", "Alumni", "Faculty"]
    const filteredData = data.filter((item) => allowedRoles.includes(item.Role))

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={filteredData}
                    dataKey="Count"
                    nameKey="Role"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill={colorThemes[selectedTheme].student}
                    label
                >
                    {filteredData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={getRoleColor(entry.Role, selectedTheme)}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

const getRoleColor = (role: string, theme: keyof typeof colorThemes) => {
    switch (role) {
        case "Student":
            return colorThemes[theme].student
        case "Alumni":
            return colorThemes[theme].alumni
        case "Faculty":
        default:
            return colorThemes[theme].other
    }
}
