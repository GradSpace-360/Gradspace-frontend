/**
 * UserGrowthChart Component
 *
 * This component renders a line chart visualizing user growth metrics over the years.
 * It displays three key metrics:
 * - Verified Users
 * - Registered Users
 * - Active Users
 *
 * Props:
 * - data: An array of objects containing the year and corresponding user metrics.
 *   Each object has the following shape:
 *   {
 *     year: string;
 *     verified: number;
 *     registered: number;
 *     active: number;
 *   }
 * - selectedTheme: A key from the colorThemes object to apply theming to the chart lines.
 * - isLoading: A boolean indicating whether the chart data is currently loading.
 *
 * Features:
 * - Responsive design to fit various screen sizes.
 * - Custom tooltip for enhanced data insight.
 * - Legend to differentiate between the user metrics.
 * - Loading skeleton displayed while data is being fetched.
 */

import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { ChartLoadingSkeleton } from "@/skeletons"

import { colorThemes } from "../ColorThemes"
import { CustomTooltip } from "./CustomTooltip"
export const UserGrowthChart = ({
    data,
    selectedTheme,
    isLoading,
}: {
    data: {
        Batch: string
        Verified: number
        Registered: number
        Active: number
    }[]
    selectedTheme: keyof typeof colorThemes
    isLoading: boolean
}) => {
    if (isLoading) {
        return <ChartLoadingSkeleton />
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="Batch" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="Verified"
                    stroke={colorThemes[selectedTheme].verified}
                    strokeWidth={2}
                    name="Verified Users"
                />
                <Line
                    type="monotone"
                    dataKey="Registered"
                    stroke={colorThemes[selectedTheme].registered}
                    strokeWidth={2}
                    name="Registered Users"
                />
                <Line
                    type="monotone"
                    dataKey="Active"
                    stroke={colorThemes[selectedTheme].active}
                    strokeWidth={2}
                    name="Active Users"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
