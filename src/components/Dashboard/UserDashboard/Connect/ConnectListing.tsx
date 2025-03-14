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
        suggestedUsers,
        filters,
        pagination,
        isLoading,
        fetchSuggestedUsers,
        fetchUsers,
        setFilters,
        setPagination,
    } = useUserStore()

    useEffect(() => {
        fetchSuggestedUsers()
        fetchUsers()
    }, [fetchSuggestedUsers, fetchUsers])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget as HTMLFormElement)
        const search = formData.get("search") as string
        setFilters({ search })
        fetchUsers()
    }

    const handlePageChange = (newPage: number) => {
        setPagination({ page: newPage })
        fetchUsers()
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    name="search"
                    placeholder="Search by name or username..."
                    className="flex-1"
                />
                <Button type="submit">Search</Button>
            </form>

            <div className="flex gap-2">
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
                        <SelectItem value="Mechanical Engineering">
                            ME
                        </SelectItem>
                        <SelectItem value="Electrical Engineering">
                            EE
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => setFilters({})}>
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

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                    Suggested Connections
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestedUsers.map((user) => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ConnectListing
