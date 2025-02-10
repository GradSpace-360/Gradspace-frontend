/**
 * userAnalyticsStore.ts
 *
 * This module defines the state management for user analytics data using Zustand.
 * It includes interfaces and functions to fetch and manage user distribution, department-wise data,
 * and yearly metrics. The store also handles loading states and errors for each data fetching operation.
 *
 * Interfaces:
 * - UserDistribution: Represents the distribution of users by role and count.
 * - DepartmentData: Represents department-wise data including registered, verified, and active users.
 * - YearlyMetrics: Represents yearly metrics including registered, verified, and active users.
 *
 * AnalyticsStore Interface:
 * - userDistribution: Array of UserDistribution objects.
 * - departmentData: Array of DepartmentData objects.
 * - yearlyMetrics: Array of YearlyMetrics objects.
 * - startYear: The starting year for fetching data.
 * - endYear: The ending year for fetching data.
 * - userDistributionLoading: Boolean indicating if user distribution data is being fetched.
 * - departmentDataLoading: Boolean indicating if department data is being fetched.
 * - yearlyMetricsLoading: Boolean indicating if yearly metrics are being fetched.
 * - error: String representing any error that occurred during data fetching.
 * - fetchUserDistributionData: Function to fetch user distribution data.
 * - fetchDepartmentWiseData: Function to fetch department-wise data for a given year range.
 * - fetchYearlyMetricsData: Function to fetch yearly metrics for a given year range.
 * - setYearRange: Function to set the year range for fetching data.
 *
 * The store is created using Zustand's `create` function, which initializes the state and defines the actions.
 */

import { create } from "zustand"

import {
    fetchDepartmentData,
    fetchUserDistribution,
    fetchYearlyMetrics,
} from "../../components/Dashboard/AdminDashboard/Analytics/Api"

interface UserDistribution {
    Role: string
    Count: number
}

interface DepartmentData {
    Department: string
    Registered: number
    Verified: number
    Active: number
}

interface YearlyMetrics {
    Batch: number
    Registered: number
    Verified: number
    Active: number
}

interface AnalyticsStore {
    userDistribution: UserDistribution[]
    departmentData: DepartmentData[]
    yearlyMetrics: YearlyMetrics[]
    startYear: number
    endYear: number
    userDistributionLoading: boolean
    departmentDataLoading: boolean
    yearlyMetricsLoading: boolean
    error: string | null
    fetchUserDistributionData: () => Promise<void>
    fetchDepartmentWiseData: (
        startYear: number,
        endYear: number
    ) => Promise<void>
    fetchYearlyMetricsData: (
        startYear: number,
        endYear: number
    ) => Promise<void>
    setYearRange: (startYear: number, endYear: number) => void
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
    userDistribution: [],
    departmentData: [],
    yearlyMetrics: [],
    startYear: 2020,
    endYear: 2025,
    userDistributionLoading: false,
    departmentDataLoading: false,
    yearlyMetricsLoading: false,
    error: null,

    fetchUserDistributionData: async () => {
        set({ userDistributionLoading: true, error: null })
        try {
            const data = await fetchUserDistribution()
            set({ userDistribution: data })
        } catch {
            set({ error: "Failed to fetch user distribution data" })
        } finally {
            set({ userDistributionLoading: false })
        }
    },

    fetchDepartmentWiseData: async (startYear, endYear) => {
        set({ departmentDataLoading: true, error: null })
        try {
            const data = await fetchDepartmentData(startYear, endYear)
            set({ departmentData: data })
        } catch {
            set({ error: "Failed to fetch department data" })
        } finally {
            set({ departmentDataLoading: false })
        }
    },

    fetchYearlyMetricsData: async (startYear, endYear) => {
        set({ yearlyMetricsLoading: true, error: null })
        try {
            const data = await fetchYearlyMetrics(startYear, endYear)
            set({ yearlyMetrics: data })
        } catch {
            set({ error: "Failed to fetch yearly metrics" })
        } finally {
            set({ yearlyMetricsLoading: false })
        }
    },

    setYearRange: (startYear, endYear) => {
        set({ startYear, endYear })
    },
}))
