/**
 * DepartmentDistributionChart Component
 *
 * This component renders a bar chart showing the distribution of departments based on user status.
 * It displays three key metrics:
 * - Registered Users
 * - Verified Users
 * - Active Users
 *
 * Props:
 * - data: An array of objects containing department names and corresponding user metrics.
 *   Each object has the following shape:
 *   {
 *     department: string;
 *     registered: number;
 *     verified: number;
 *     active: number;
 *   }
 * - selectedTheme: A key from the colorThemes object to apply theming to the chart bars.
 * - isLoading: A boolean indicating whether the chart data is currently loading.
 *
 * Features:
 * - Responsive design to fit various screen sizes.
 * - Custom tooltip for enhanced data insight.
 * - Legend to differentiate between the user metrics.
 * - Loading skeleton displayed while data is being fetched.
 */

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { ChartLoadingSkeleton } from "@/skeletons"

import { colorThemes } from "../ColorThemes"
import { CustomTooltip } from "./CustomTooltip"

interface DepartmentData {
    Department: string
    Registered: number
    Verified: number
    Active: number
}

export const DepartmentDistributionChart = ({
    data,
    selectedTheme,
    isLoading,
}: {
    data: DepartmentData[]
    selectedTheme: keyof typeof colorThemes
    isLoading: boolean
}) => {
    if (isLoading) {
        return <ChartLoadingSkeleton />
    }
    const formatDepartmentShort = (dept: string): string => {
        const abbreviations: Record<string, string> = {
            "Electronics and Communication Engineering": "ECE",
            "Electrical and Electronics Engineering": "EEE",
            "Mechanical Engineering": "ME",
            "Computer Science Engineering": "CSE",
        }
        return abbreviations[dept] || dept
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="Department"
                    tickFormatter={formatDepartmentShort}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                    dataKey="Registered"
                    fill={colorThemes[selectedTheme].registered}
                    name="Registered Users"
                />
                <Bar
                    dataKey="Verified"
                    fill={colorThemes[selectedTheme].verified}
                    name="Verified Users"
                />
                <Bar
                    dataKey="Active"
                    fill={colorThemes[selectedTheme].active}
                    name="Active Users"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
