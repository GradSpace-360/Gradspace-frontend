/**
 * `UserFilters` Component
 *
 * This component provides a user-friendly filter form for managing a dataset of users.
 * It allows filtering by search keywords, batch, department, and role, with options
 * to apply and reset filters. Designed to be responsive across different screen sizes.
 * Props:
 * - `filters: Filters` - The current filter values, including:
 *   - `search: string` - Search query to filter users by name or email.
 *   - `batch: string` - Selected batch year for filtering.
 *   - `department: string` - Selected department for filtering.
 *   - `role: string` - Selected role for filtering.
 * - `onFilterChange: (filters: Filters) => void` - Callback triggered when filters are applied.
 * - `onResetFilters: () => void` - Callback triggered when filters are reset.
 *
 * Features:
 * - Responsive grid layout for filter inputs.
 * - Dynamic batch year generation from 1995 to the current year.
 * - Dropdowns for selecting batch, department, and role with pre-defined options.
 * - Search bar for quick filtering by user name or email.
 * - Buttons to apply or reset filters, enhancing user experience.
 * Example Usage:
 * ```tsx
 * const filters = { search: "", batch: "", department: "", role: "" };
 * const handleFilterChange = (newFilters: Filters) => console.log(newFilters);
 * const handleResetFilters = () => console.log("Filters reset");
 * <UserFilters
 *     filters={filters}
 *     onFilterChange={handleFilterChange}
 *     onResetFilters={handleResetFilters}
 * />
 * ```
 * Note:
 * - Ensure the `filters` prop is maintained in the parent component for state management.
 * - All dropdown options are pre-defined and can be extended as needed.
 */
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Filters {
    search: string
    batch: string
    department: string
    role: string
}

interface UserFiltersProps {
    filters: Filters
    onFilterChange: (filters: Filters) => void
    onResetFilters: () => void
}

const departments = [
    {
        id: 1,
        value: "Computer Science Engineering",
        label: "Computer Science Engineering",
    },
    {
        id: 2,
        value: "Electrical and Electronic Engineering",
        label: "Electrical and Electronic Engineering",
    },
    {
        id: 3,
        value: "Electronics and Communication Engineering",
        label: "Electronics and Communication Engineering",
    },
    { id: 4, value: "Mechanical Engineering", label: "Mechanical Engineering" },
]

const roles = [
    { id: 1, value: "Student", label: "Student" },
    { id: 2, value: "Alumni", label: "Alumni" },
    { id: 3, value: "Faculty", label: "Faculty" },
]

const generateBatchYears = () => {
    const currentYear = new Date().getFullYear()
    const startYear = 1995
    return Array.from({ length: currentYear - startYear + 1 }, (_, index) => ({
        id: index + 1,
        value: (startYear + index).toString(),
        label: (startYear + index).toString(),
    }))
}

export function UserFilters({
    filters,
    onFilterChange,
    onResetFilters,
}: UserFiltersProps) {
    const form = useForm<Filters>({ defaultValues: filters })

    const onSubmit = (data: Filters) => onFilterChange(data)
    const handleReset = () => {
        form.reset({ search: "", batch: "", department: "", role: "" })
        onResetFilters()
    }

    const batches = generateBatchYears()

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Search</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Search by name or email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="batch"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Batch</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Batches" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {batches.map((batch) => (
                                            <SelectItem
                                                key={batch.id}
                                                value={batch.value}
                                            >
                                                {batch.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Departments" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {departments.map((department) => (
                                            <SelectItem
                                                key={department.id}
                                                value={department.value}
                                            >
                                                {department.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Roles" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.id}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-2">
                    <Button type="submit">Apply Filters</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                    >
                        Reset Filters
                    </Button>
                </div>
            </form>
        </Form>
    )
}
