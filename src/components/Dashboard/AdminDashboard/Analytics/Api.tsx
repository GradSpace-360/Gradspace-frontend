import { axiosPrivate } from "@/config/axiosInstance"

export const fetchUserDistribution = async () => {
    try {
        const response = await axiosPrivate.get(
            `/admin/analytics/user-distribution`
        )
        console.log("user data ", response.data.data)
        return response.data.data ? response.data.data : []
    } catch (error) {
        console.error("Error fetching user distribution data:", error)
        throw error
    }
}

export const fetchDepartmentData = async (
    startYear: number,
    endYear: number
) => {
    try {
        const response = await axiosPrivate.get(
            `/admin/analytics/department-data`,
            {
                params: { startYear, endYear },
            }
        )
        console.log("department data ", response.data.data)
        return response.data.data ? response.data.data : []
    } catch (error) {
        console.error("Error fetching department data:", error)
        throw error
    }
}

export const fetchYearlyMetrics = async (
    startYear: number,
    endYear: number
) => {
    try {
        const response = await axiosPrivate.get(
            `/admin/analytics/yearly-metrics`,
            {
                params: { startYear, endYear },
            }
        )
        console.log("yearly data ", response.data.data)
        return response.data.data ? response.data.data : []
    } catch (error) {
        console.error("Error fetching yearly metrics:", error)
        throw error
    }
}
