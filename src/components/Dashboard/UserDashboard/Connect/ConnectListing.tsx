import { Search } from "lucide-react"
import { useEffect } from "react"

import { Pagination } from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

import { useUserStore } from "./user-store"
import UserCard from "./UserCard"

const ConnectListing = () => {
    const {
        users,
        filters,
        pagination,
        isLoading,
        // fetchSuggestedUsers,
        fetchUsers,
        setFilters,
        setPagination,
    } = useUserStore()

    useEffect(() => {
        // fetchSuggestedUsers()
        fetchUsers()
    }, [fetchUsers])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const search = formData.get("search") as string
        setFilters({ search })
        setPagination({ page: 1 })
        fetchUsers()
    }

    const handlePageChange = (newPage: number) => {
        setPagination({ page: newPage })
        fetchUsers()
    }

    // Generates an array of year strings from 1995 to the current year
    const getYearRange = () => {
        const currentYear = new Date().getFullYear()
        const years: number[] = []
        for (let year = 1995; year <= currentYear; year++) {
            years.push(year)
        }
        return years
    }

    return (
        <div className="space-y-6">
            <h1 className="flex items-center gap-2 gradient-title font-semibold text-xl sm:text-3xl font-philosopher">
                <Search className="w-6 h-6" />
                Smart Connect
            </h1>
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    name="search"
                    placeholder="Search by name or username..."
                    className="flex-1"
                    value={filters.search || ""}
                    onChange={(e) => setFilters({ search: e.target.value })}
                />
                <Button type="submit">Search</Button>
            </form>

            <div className="flex gap-2 flex-col md:flex-row">
                <Select
                    value={filters.role}
                    onValueChange={(value) => setFilters({ role: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                        <SelectItem value="Faculty">Faculty</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters({ department: value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Computer Science Engineering">
                            CSE
                        </SelectItem>
                        <SelectItem value="Electrical and Electronics Engineering">
                            EEE
                        </SelectItem>
                        <SelectItem value="Electronics and Communication Engineering">
                            ECE
                        </SelectItem>
                        <SelectItem value="Mechanical Engineering">
                            ME
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Filter by skill"
                    value={
                        filters.skills && filters.skills.length > 0
                            ? filters.skills[0]
                            : ""
                    }
                    onChange={(e) => setFilters({ skills: [e.target.value] })}
                    className="w-full md:w-auto"
                />

                <Input
                    placeholder="Filter by interest"
                    value={
                        filters.interests && filters.interests.length > 0
                            ? filters.interests[0]
                            : ""
                    }
                    onChange={(e) =>
                        setFilters({ interests: [e.target.value] })
                    }
                    className="w-full md:w-auto"
                />

                <Select
                    // Render batch as a string; if undefined, the placeholder is shown
                    value={
                        filters.batch !== undefined ? String(filters.batch) : ""
                    }
                    onValueChange={(value: string) =>
                        setFilters({ batch: Number(value) })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by batch" />
                    </SelectTrigger>
                    <SelectContent>
                        {getYearRange().map((year) => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant="destructive"
                    onClick={() => {
                        setFilters({
                            role: "",
                            department: "",
                            search: "",
                            skills: [],
                            interests: [],
                            batch: undefined,
                        })
                        setPagination({ page: 1 })
                        fetchUsers()
                    }}
                >
                    Clear Filters
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    Array(6)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-[200px] w-full rounded-lg"
                            />
                        ))
                ) : users.length > 0 ? (
                    users.map((user) => <UserCard key={user.id} user={user} />)
                ) : (
                    <div className="col-span-full text-center py-8">
                        No users found
                    </div>
                )}
            </div>

            <Pagination
                currentPage={pagination.page}
                totalPages={Math.ceil(pagination.total / pagination.limit)}
                onPageChange={handlePageChange}
            />

            {/* Suggested Connections section commented out */}
            {/* <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                    Suggested Connections
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedUsers.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            </div> */}
        </div>
    )
}

export default ConnectListing
