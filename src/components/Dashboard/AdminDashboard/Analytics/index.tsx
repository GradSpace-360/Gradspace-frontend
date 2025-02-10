import { Activity, Building, UserPlus, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAnalyticsStore } from "@/store/admin/userAnalyticsStore"

import { DepartmentDistributionChart } from "./charts/DepartmentDistributionChart"
import { UserDistributionChart } from "./charts/UserDistributionChart"
import { UserGrowthChart } from "./charts/UserGrowthChart"
import { YearlyMetricsChart } from "./charts/YearlyMetricsChart"
import { colorThemes } from "./ColorThemes"
import { MetricCard } from "./MetricCard"
import { ThemeSelect } from "./ThemeSelect"
import { YearSelect } from "./YearSelect"

export default function AnalyticsDashboardPage() {
    const {
        userDistribution,
        departmentData,
        yearlyMetrics,
        startYear,
        endYear,
        userDistributionLoading,
        departmentDataLoading,
        yearlyMetricsLoading,
        error,
        fetchUserDistributionData,
        fetchDepartmentWiseData,
        fetchYearlyMetricsData,
        setYearRange,
    } = useAnalyticsStore()

    const [selectedStartYear, setSelectedStartYear] = useState(startYear)
    const [selectedTheme, setSelectedTheme] =
        useState<keyof typeof colorThemes>("vibrant")

    // Fetch user distribution once on mount
    useEffect(() => {
        fetchUserDistributionData()
    }, [fetchUserDistributionData])

    // Fetch department and yearly metrics data on mount and when year range changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchDepartmentWiseData(startYear, endYear)
                await fetchYearlyMetricsData(startYear, endYear)
            } catch (err) {
                console.error("Failed to fetch data:", err)
            }
        }
        fetchData()
    }, [startYear, endYear, fetchDepartmentWiseData, fetchYearlyMetricsData])

    const yearlyMetricsFormatted = useMemo(() => {
        return (
            yearlyMetrics?.map((metric) => ({
                ...metric,
                Batch: metric.Batch.toString(),
            })) || []
        )
    }, [yearlyMetrics])

    const handleYearRangeChange = (newStartYear: number) => {
        const newEndYear = newStartYear + 5
        setSelectedStartYear(newStartYear)
        setYearRange(newStartYear, newEndYear)
    }

    const yearOptions = useMemo(() => {
        const years = []
        const currentYear = new Date().getFullYear()
        for (let year = 1995; year <= currentYear - 5; year++) {
            years.push(year)
        }
        return years
    }, [])

    const handleThemeChange = (value: string) => {
        if (Object.keys(colorThemes).includes(value)) {
            setSelectedTheme(value as keyof typeof colorThemes)
        }
    }

    if (error) {
        return (
            <div className="flex h-[600px] w-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500">
                        Error Loading Data
                    </h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </div>
        )
    }

    const totalUsers = Array.isArray(userDistribution)
        ? userDistribution.reduce((acc, curr) => acc + curr.Count, 0)
        : 0
    const departmentCount = departmentData?.length || 0
    const activeUsers =
        yearlyMetrics.length > 0
            ? yearlyMetrics[yearlyMetrics.length - 1].Active
            : 0
    const registeredUsers =
        yearlyMetrics.length > 0
            ? yearlyMetrics[yearlyMetrics.length - 1].Registered
            : 0

    return (
        <div className="flex flex-col gap-4 p-4 pt-10 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Analytics Dashboard
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Insights and metrics at a glance
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <YearSelect
                        selectedStartYear={selectedStartYear}
                        onYearChange={(value) =>
                            handleYearRangeChange(parseInt(value))
                        }
                        yearOptions={yearOptions}
                    />
                    <ThemeSelect
                        selectedTheme={selectedTheme}
                        onThemeChange={handleThemeChange}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    isLoading={userDistributionLoading}
                />
                <MetricCard
                    title="Departments"
                    value={departmentCount}
                    icon={Building}
                    isLoading={departmentDataLoading}
                />
                <MetricCard
                    title="Active Users"
                    value={activeUsers}
                    icon={Activity}
                    isLoading={yearlyMetricsLoading}
                />
                <MetricCard
                    title="Registered Users"
                    value={registeredUsers}
                    icon={UserPlus}
                    isLoading={yearlyMetricsLoading}
                />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="departments">Departments</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly Metrics</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
                        {/* User Growth Card */}
                        <Card className="w-full md:col-span-4">
                            <CardHeader>
                                <CardTitle>User Growth</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <UserGrowthChart
                                    data={yearlyMetricsFormatted}
                                    selectedTheme={selectedTheme}
                                    isLoading={yearlyMetricsLoading}
                                />
                            </CardContent>
                        </Card>

                        {/* User Distribution Card */}
                        <Card className="w-full md:col-span-3">
                            <CardHeader>
                                <CardTitle>User Distribution</CardTitle>
                                <CardDescription>
                                    Breakdown of users by role
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserDistributionChart
                                    data={userDistribution}
                                    selectedTheme={selectedTheme}
                                    isLoading={userDistributionLoading}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="departments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Department Distribution</CardTitle>
                            <CardDescription>
                                Number of users per department (Registered,
                                Verified, Active)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DepartmentDistributionChart
                                data={departmentData}
                                selectedTheme={selectedTheme}
                                isLoading={departmentDataLoading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="yearly">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yearly Metrics</CardTitle>
                            <CardDescription>
                                Tracking user engagement over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <YearlyMetricsChart
                                data={yearlyMetricsFormatted}
                                selectedTheme={selectedTheme}
                                isLoading={yearlyMetricsLoading}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
