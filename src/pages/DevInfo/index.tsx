import { motion } from "framer-motion"
import {
    BarChart3,
    Code,
    FlaskConical,
    GithubIcon,
    GitPullRequest,
    Linkedin,
    Server,
    Star,
    Users,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from "recharts"

import Github from "@/assets/github.svg"
import DotBackground from "@/components/DotBackground"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// GitHub API response types
export interface GitHubRepository {
    name: string
    description: string
    html_url: string
    stargazers_count: number
    forks_count: number
    open_issues_count: number
    updated_at: string
    language: string
    default_branch: string
    branches_url: string
}

export interface GitHubBranch {
    name: string
    commit: {
        sha: string
        url: string
    }
}

export interface GitHubContributor {
    login: string
    id: number
    avatar_url: string
    html_url: string
    contributions: number
}

export interface GitHubCommitActivity {
    total: number
    week: number
    days: number[]
}

export interface GitHubUser {
    login: string
    avatar_url: string
    html_url: string
    name: string
    bio: string
}

// Transformed data types
export interface Repository {
    name: string
    description: string
    url: string
    stars: number
    forks: number
    issues: number
    pullRequests: number
    lastUpdated: string
    language: string
    contributors: number
    status: "active" | "maintenance" | "stable" | "deprecated"
    branch?: string
}

export interface ContributionData {
    name: string
    login: string
    contributions: number
    avatar: string
    url: string
}

export interface CommitActivity {
    date: string
    commits: number
}

// Function to determine repository status based on activity
export function determineRepoStatus(
    repo: GitHubRepository,
    commitActivity: GitHubCommitActivity[]
): Repository["status"] {
    if (!commitActivity || commitActivity.length === 0) return "maintenance"

    // Check if there were commits in the last month
    const lastMonth = commitActivity[commitActivity.length - 1]
    const hasRecentCommits = lastMonth && lastMonth.total > 0

    // Check update date
    const lastUpdated = new Date(repo.updated_at)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    if (hasRecentCommits && lastUpdated > threeMonthsAgo) {
        return "active"
    } else if (lastUpdated > threeMonthsAgo) {
        return "maintenance"
    } else {
        return "stable"
    }
}

// Format date to readable string
export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

// Transform commit activity data for the chart
export function transformCommitActivity(
    commitActivity: GitHubCommitActivity[]
): CommitActivity[] {
    if (!commitActivity || commitActivity.length === 0) {
        return []
    }

    // Get the last 12 weeks of data or less if not available
    const weeksToShow = Math.min(commitActivity.length, 12)
    const relevantData = commitActivity.slice(-weeksToShow)

    return relevantData.map((week) => {
        // Convert Unix timestamp to date
        const date = new Date(week.week * 1000)
        return {
            date: date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
            commits: week.total,
        }
    })
}

// GitHub API base URL
const API_BASE = "https://api.github.com"

// Developer data
interface Developer {
    name: string
    role: string
    summary: string
    experience: string
    skills: string[]
    linkedin: string
    github: string
    icon: JSX.Element
    githubUsername?: string
}

const developers: Developer[] = [
    {
        name: "Sujith T S",
        role: "Frontend Developer",
        summary:
            "Passionate about creating intuitive and responsive user interfaces using React.js and TypeScript.",
        experience: "1+ years of experience in frontend development",
        skills: ["React", "TypeScript", "Tailwind CSS", "Golang"],
        linkedin: "https://www.linkedin.com/in/07sujithts/",
        github: "https://github.com/07SUJITH",
        icon: <Code className="w-6 h-6" />,
        githubUsername: "07SUJITH",
    },
    {
        name: "Jelan Mathew James",
        role: "Backend Developer",
        summary:
            "Skilled in building robust and scalable backend systems using Golang, Python, and various web frameworks.",
        experience: "3+ years of experience in backend development",
        skills: ["Golang", "Python", "Docker", "Kubernetes"],
        linkedin: "https://www.linkedin.com/in/jelan-mathew-james-571490220/",
        github: "https://github.com/jelanmathewjames",
        icon: <Server className="w-6 h-6" />,
        githubUsername: "jelanmathewjames",
    },
    {
        name: "Joel Siby Varghese",
        role: "Quality Assurance Tester",
        summary:
            "Dedicated to ensuring product quality through comprehensive testing strategies",
        experience: "1+ years of experience in software testing",
        skills: ["Postman", "Black-Box Testing", "Functional Testing"],
        linkedin: "https://www.linkedin.com/in/joel-siby-varghese-7656a2261/",
        github: "https://github.com/joelsibyvarghese",
        icon: <FlaskConical className="w-6 h-6" />,
        githubUsername: "joelsibyvarghese",
    },
]

// Repositories to fetch
const reposToFetch = [
    { owner: "GradSpace-360", repo: "Gradspace-frontend", branch: "main" },
    { owner: "GradSpace-360", repo: "gradspaceBK", branch: "dev" },
]

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
        },
    },
}

// Helper functions for repository status
const getStatusColor = (status: Repository["status"]) => {
    switch (status) {
        case "active":
            return "bg-green-500"
        case "maintenance":
            return "bg-blue-500"
        case "stable":
            return "bg-yellow-500"
        case "deprecated":
            return "bg-red-500"
        default:
            return "bg-gray-500"
    }
}

const getStatusText = (status: Repository["status"]) => {
    switch (status) {
        case "active":
            return "Active Development"
        case "maintenance":
            return "Maintenance Mode"
        case "stable":
            return "Stable Release"
        case "deprecated":
            return "Deprecated"
        default:
            return "Unknown"
    }
}

// Main component
export default function DevInfo() {
    const [activeTab, setActiveTab] = useState("team")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [repositories, setRepositories] = useState<Repository[]>([])
    const [contributors, setContributors] = useState<ContributionData[]>([])
    const [commitActivity, setCommitActivity] = useState<CommitActivity[]>([])
    const abortControllerRef = useRef<AbortController | null>(null)
    const [dataFetched, setDataFetched] = useState(false)

    const findContributorData = (
        githubUsername?: string
    ): ContributionData | null => {
        if (!githubUsername) return null
        const contributor = contributors.find(
            (c) => c.login.toLowerCase() === githubUsername.toLowerCase()
        )
        return contributor || null
    }

    // Fetch data with proper error handling and request cancellation
    useEffect(() => {
        // Skip if data is already fetched
        if (dataFetched) return

        // Create a new AbortController for this effect
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        const fetchRepository = async (
            owner: string,
            repo: string,
            branch: string
        ): Promise<Repository | null> => {
            try {
                // Basic repo info
                const repoResponse = await fetch(
                    `${API_BASE}/repos/${owner}/${repo}`,
                    { signal }
                )

                if (!repoResponse.ok) {
                    throw new Error(
                        `Failed to fetch repository: ${repoResponse.status}`
                    )
                }

                const repoData: GitHubRepository = await repoResponse.json()

                // Commit activity with retry logic for 202 responses
                let commitActivity: GitHubCommitActivity[] = []
                let retries = 0
                const maxRetries = 2

                // Use the specified branch for stats
                const branchParam = branch !== "main" ? `?sha=${branch}` : ""

                while (retries <= maxRetries) {
                    const commitActivityResponse = await fetch(
                        `${API_BASE}/repos/${owner}/${repo}/stats/commit_activity${branchParam}`,
                        { signal }
                    )

                    if (commitActivityResponse.status === 202) {
                        // GitHub is computing the stats, wait and retry
                        retries++
                        if (retries <= maxRetries) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            )
                            continue
                        }
                    } else if (commitActivityResponse.ok) {
                        commitActivity = await commitActivityResponse.json()
                    }
                    break
                }

                // Fetch actual contributors count
                const contributorsResponse = await fetch(
                    `${API_BASE}/repos/${owner}/${repo}/contributors?per_page=1${branchParam}`,
                    { signal }
                )

                let contributorsCount = 0
                if (contributorsResponse.ok) {
                    const linkHeader = contributorsResponse.headers.get("Link")
                    if (linkHeader && linkHeader.includes('rel="last"')) {
                        const match = linkHeader.match(
                            /page=(\d+)>; rel="last"/
                        )
                        contributorsCount = match
                            ? Number.parseInt(match[1], 10)
                            : 0
                    } else {
                        // If there's no "last" link, there's only one page
                        contributorsCount = (await contributorsResponse.json())
                            .length
                    }
                }

                // Fetch pull requests count
                const pullsResponse = await fetch(
                    `${API_BASE}/repos/${owner}/${repo}/pulls?state=all&per_page=1`,
                    { signal }
                )

                let pullsCount = 0
                if (pullsResponse.ok) {
                    const linkHeader = pullsResponse.headers.get("Link")
                    if (linkHeader && linkHeader.includes('rel="last"')) {
                        const match = linkHeader.match(
                            /page=(\d+)>; rel="last"/
                        )
                        pullsCount = match ? Number.parseInt(match[1], 10) : 0
                    } else {
                        // If there's no "last" link, there's only one page
                        pullsCount = (await pullsResponse.json()).length
                    }
                }

                return {
                    name: repoData.name,
                    description:
                        repoData.description || "No description provided",
                    url: repoData.html_url,
                    stars: repoData.stargazers_count,
                    forks: repoData.forks_count,
                    issues: repoData.open_issues_count,
                    pullRequests: pullsCount,
                    lastUpdated: formatDate(repoData.updated_at),
                    language: repoData.language || "Not specified",
                    contributors: contributorsCount,
                    status: determineRepoStatus(repoData, commitActivity),
                    branch: branch !== "main" ? branch : undefined,
                }
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") {
                        console.log("Fetch aborted")
                        return null
                    }
                    console.error("Error fetching repository:", error.message)
                }
                return null
            }
        }

        const fetchContributors = async (
            owner: string,
            repo: string,
            branch: string
        ): Promise<ContributionData[]> => {
            try {
                const branchParam = branch !== "main" ? `?sha=${branch}` : ""
                const response = await fetch(
                    `${API_BASE}/repos/${owner}/${repo}/contributors?per_page=100${branchParam}`,
                    {
                        signal,
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch contributors: ${response.status}`
                    )
                }

                const contributors: GitHubContributor[] = await response.json()

                // Map contributors without additional API calls to avoid rate limits
                return contributors.map((contributor) => ({
                    name: contributor.login,
                    login: contributor.login,
                    contributions: contributor.contributions,
                    avatar: contributor.avatar_url,
                    url: contributor.html_url,
                }))
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") {
                        console.log("Fetch aborted")
                        return []
                    }
                    console.error("Error fetching contributors:", error.message)
                }
                return []
            }
        }

        const fetchCommitActivity = async (
            owner: string,
            repo: string,
            branch: string
        ): Promise<CommitActivity[]> => {
            try {
                // Try to fetch commit activity with retry for 202
                let retries = 0
                const maxRetries = 2
                const branchParam = branch !== "main" ? `?sha=${branch}` : ""

                while (retries <= maxRetries) {
                    const response = await fetch(
                        `${API_BASE}/repos/${owner}/${repo}/stats/commit_activity${branchParam}`,
                        {
                            signal,
                        }
                    )

                    if (response.status === 202) {
                        // GitHub is computing the stats, wait and retry
                        retries++
                        if (retries <= maxRetries) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, 1000)
                            )
                            continue
                        }
                        return [] // Return empty if still computing after retries
                    } else if (response.ok) {
                        const commitActivity: GitHubCommitActivity[] =
                            await response.json()
                        return transformCommitActivity(commitActivity)
                    } else {
                        throw new Error(
                            `Failed to fetch commit activity: ${response.status}`
                        )
                    }
                }
                return []
            } catch (error) {
                if (error instanceof Error) {
                    if (error.name === "AbortError") {
                        console.log("Fetch aborted")
                        return []
                    }
                    console.error(
                        "Error fetching commit activity:",
                        error.message
                    )
                }
                return []
            }
        }

        const loadData = async () => {
            try {
                setLoading(true)

                // Use Promise.allSettled to handle partial failures
                const repoPromises = reposToFetch.map(
                    ({ owner, repo, branch }) =>
                        fetchRepository(owner, repo, branch)
                )

                const repoResults = await Promise.allSettled(repoPromises)
                const validRepos = repoResults
                    .filter(
                        (
                            result
                        ): result is PromiseFulfilledResult<Repository> =>
                            result.status === "fulfilled" &&
                            result.value !== null
                    )
                    .map((result) => result.value)

                // Fetch contributors from all repos and combine them
                let allContributors: ContributionData[] = []
                let combinedCommitActivity: CommitActivity[] = []

                if (validRepos.length > 0 && !signal.aborted) {
                    // Fetch contributors from all repos
                    const contributorPromises = reposToFetch.map(
                        ({ owner, repo, branch }) =>
                            fetchContributors(owner, repo, branch)
                    )

                    const contributorResults =
                        await Promise.allSettled(contributorPromises)
                    const validContributorSets = contributorResults
                        .filter(
                            (
                                result
                            ): result is PromiseFulfilledResult<
                                ContributionData[]
                            > => result.status === "fulfilled"
                        )
                        .map((result) => result.value)

                    // Combine and deduplicate contributors
                    const contributorMap = new Map<string, ContributionData>()

                    validContributorSets.forEach((contributorSet) => {
                        contributorSet.forEach((contributor) => {
                            const existing = contributorMap.get(
                                contributor.login
                            )
                            if (existing) {
                                // Combine contributions if the contributor exists in multiple repos
                                existing.contributions +=
                                    contributor.contributions
                            } else {
                                contributorMap.set(
                                    contributor.login,
                                    contributor
                                )
                            }
                        })
                    })

                    allContributors = Array.from(contributorMap.values())

                    // Sort by contributions (highest first)
                    allContributors.sort(
                        (a, b) => b.contributions - a.contributions
                    )

                    // Fetch commit activity for the first repo (frontend)
                    const frontendRepo = reposToFetch[0]
                    const frontendCommitActivity = await fetchCommitActivity(
                        frontendRepo.owner,
                        frontendRepo.repo,
                        frontendRepo.branch
                    )

                    combinedCommitActivity = frontendCommitActivity
                }

                if (!signal.aborted) {
                    setRepositories(validRepos)
                    setContributors(allContributors)
                    setCommitActivity(combinedCommitActivity)
                    setError(null)
                    setDataFetched(true)
                }
            } catch (err) {
                if (!signal.aborted) {
                    console.error("Error loading data:", err)
                    setError("Failed to load data. Please try again later.")
                }
            } finally {
                if (!signal.aborted) {
                    setLoading(false)
                }
            }
        }

        loadData()

        // Cleanup function to abort fetch requests when component unmounts
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
                abortControllerRef.current = null
            }
        }
    }, [dataFetched])

    return (
        <motion.div
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <DotBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.h1
                    className="text-4xl font-bold font-philosopher text-center mb-6 text-gray-900 dark:text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    GradSpace Development
                </motion.h1>

                <motion.p
                    className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    GradSpace is an innovative platform designed to connect
                    graduates with opportunities. Our development team is
                    committed to building a robust, user-friendly application
                    that serves the needs of recent graduates and employers
                    alike.
                </motion.p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <p>{error}</p>
                        <p className="text-sm mt-1">
                            Using fallback data for demonstration purposes.
                        </p>
                    </div>
                )}

                <Tabs
                    defaultValue="team"
                    className="mb-12"
                    onValueChange={setActiveTab}
                >
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="repositories">
                            Repositories
                        </TabsTrigger>
                        <TabsTrigger value="contributions">
                            Contributions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="team" className="mt-6">
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {developers.map((dev) => (
                                <DeveloperCard
                                    key={dev.name}
                                    dev={dev}
                                    contributorData={findContributorData(
                                        dev.githubUsername
                                    )}
                                    loading={loading}
                                />
                            ))}
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="repositories" className="mt-6">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate={
                                activeTab === "repositories"
                                    ? "visible"
                                    : "hidden"
                            }
                        >
                            {loading ? (
                                // Loading skeletons for repositories
                                Array(2)
                                    .fill(0)
                                    .map((_, index) => (
                                        <RepositorySkeleton key={index} />
                                    ))
                            ) : repositories.length > 0 ? (
                                repositories.map((repo) => (
                                    <RepositoryCard
                                        key={repo.name}
                                        repo={repo}
                                    />
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-10">
                                    <GithubIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        No Repository Data Available
                                    </h3>
                                    <p className="text-gray-500">
                                        We couldn't load the repository data at
                                        this time.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="contributions" className="mt-6">
                        <motion.div
                            className="grid grid-cols-1 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate={
                                activeTab === "contributions"
                                    ? "visible"
                                    : "hidden"
                            }
                        >
                            {loading ? (
                                <>
                                    <ContributionGraphSkeleton />
                                    <TopContributorsSkeleton />
                                </>
                            ) : (
                                <>
                                    <ContributionGraph
                                        commitActivity={commitActivity}
                                    />
                                    <TopContributors data={contributors} />
                                </>
                            )}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </motion.div>
    )
}

// Developer card component
function DeveloperCard({
    dev,
    contributorData,
    loading,
}: {
    dev: Developer
    contributorData: ContributionData | null
    loading: boolean
}) {
    return (
        <motion.div
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }} // Reduced scale for better performance
            transition={{ type: "spring", stiffness: 200 }}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <div>{dev.icon}</div>
                        <h2 className="ml-2 text-2xl font-philosopher font-semibold text-gray-900 dark:text-white">
                            {dev.name}
                        </h2>
                    </div>

                    {loading ? (
                        <Skeleton className="h-12 w-12 rounded-full" />
                    ) : contributorData ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary">
                            <img
                                src={
                                    contributorData.avatar ||
                                    "/placeholder.svg?height=48&width=48"
                                }
                                alt={dev.name}
                                width={48}
                                height={48}
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary bg-gray-200 flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                    )}
                </div>

                <p className="text-lg font-medium text-primary mb-2">
                    {dev.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {dev.summary}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {dev.experience}
                </p>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Skills:</h3>
                    <div className="flex flex-wrap gap-2">
                        {dev.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        <div>
                            <a
                                href={dev.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                        <div>
                            <a
                                href={dev.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                            >
                                <img
                                    src={
                                        Github
                                            ? Github
                                            : "/placeholder.svg?height=24&width=24"
                                    }
                                    alt="github"
                                    className="w-6 h-6"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
// Repository card component
function RepositoryCard({ repo }: { repo: Repository }) {
    return (
        <motion.div
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.01 }} // Reduced scale for better performance
            transition={{ type: "spring", stiffness: 200 }}
        >
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <GithubIcon className="w-6 h-6 mr-2" />
                        <h2 className="text-2xl font-philosopher font-semibold text-gray-900 dark:text-white">
                            {repo.name}
                            {repo.branch && (
                                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                                    ({repo.branch})
                                </span>
                            )}
                        </h2>
                    </div>
                    <div className="flex items-center">
                        <span
                            className={`inline-block w-3 h-3 ${getStatusColor(repo.status)} rounded-full mr-2`}
                        ></span>
                        <span className="text-sm font-medium">
                            {getStatusText(repo.status)}
                        </span>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {repo.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Star className="w-4 h-4 mr-2" />
                            <span>{repo.stars} stars</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <GitPullRequest className="w-4 h-4 mr-2" />
                            <span>{repo.pullRequests} pull requests</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{repo.contributors} contributors</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Code className="w-4 h-4 mr-2" />
                            <span>{repo.language}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Last updated: {repo.lastUpdated}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            <span>{repo.issues} open issues</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <Button asChild className="w-full">
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View Repository
                        </a>
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}

// Contribution graph component
function ContributionGraph({
    commitActivity,
}: {
    commitActivity: CommitActivity[]
}) {
    if (commitActivity.length === 0) {
        return (
            <motion.div
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden p-8 text-center"
                variants={itemVariants}
            >
                <GithubIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                    No Commit Activity Data Available
                </h3>
                <p className="text-gray-500">
                    We couldn't load the commit activity data at this time.
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
            variants={itemVariants}
        >
            <CardHeader>
                <CardTitle>Contribution Activity</CardTitle>
                <CardDescription>
                    Total commits over time across repositories
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={commitActivity}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="colorCommits"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--primary))"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--primary))"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-muted"
                            />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background border border-border p-2 rounded-md shadow-md">
                                                <p className="font-medium">{`${payload[0].payload.date}`}</p>
                                                <p className="text-primary">{`${payload[0].value} commits`}</p>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="commits"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#colorCommits)"
                                name="Commits"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </motion.div>
    )
}

// Top contributors component
function TopContributors({ data }: { data: ContributionData[] }) {
    if (data.length === 0) {
        return (
            <motion.div
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden p-8 text-center"
                variants={itemVariants}
            >
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                    No Contributor Data Available
                </h3>
                <p className="text-gray-500">
                    We couldn't load the contributor data at this time.
                </p>
            </motion.div>
        )
    }

    const totalContributions = data.reduce(
        (sum, item) => sum + item.contributions,
        0
    )

    return (
        <motion.div
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden"
            variants={itemVariants}
        >
            <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>
                    Most active contributors across repositories
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {data.map((contributor, index) => {
                        const percentage = Math.round(
                            (contributor.contributions / totalContributions) *
                                100
                        )

                        return (
                            <div key={contributor.login} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="relative mr-3">
                                            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                                {index + 1}
                                            </div>
                                            <img
                                                src={
                                                    contributor.avatar
                                                        ? contributor.avatar
                                                        : "/placeholder.svg?height=40&width=40"
                                                }
                                                alt={contributor.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div>
                                            <a
                                                href={contributor.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium hover:underline"
                                            >
                                                {contributor.name}
                                            </a>
                                            <div className="text-sm text-muted-foreground">
                                                {contributor.contributions}{" "}
                                                contributions
                                            </div>
                                        </div>
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="text-sm font-medium">
                                                    {percentage}%
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    {percentage}% of total
                                                    contributions
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <Progress value={percentage} className="h-2" />
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </motion.div>
    )
}

// Skeleton components for loading states
function RepositorySkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-6" />

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                <Skeleton className="h-10 w-full mt-4" />
            </div>
        </div>
    )
}

function ContributionGraphSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />
                <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded-md animate-pulse" />
            </div>
        </div>
    )
}

function TopContributorsSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-6" />

                <div className="space-y-6">
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                                        <div>
                                            <Skeleton className="h-5 w-32" />
                                            <Skeleton className="h-4 w-24 mt-1" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-8" />
                                </div>
                                <Skeleton className="h-2 w-full" />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
