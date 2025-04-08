import "jspdf-autotable"

import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Download, Filter, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import useHigherEducationStore from "@/store/admin/higherEducationStore"

const departments = [
    {
        id: 1,
        value: "Computer Science Engineering",
        label: "Computer Science Engineering",
    },
    {
        id: 2,
        value: "Electrical and Electronics Engineering",
        label: "Electrical and Electronics Engineering",
    },
    {
        id: 3,
        value: "Electronics and Communication Engineering",
        label: "Electronics and Communication Engineering",
    },
    { id: 4, value: "Mechanical Engineering", label: "Mechanical Engineering" },
]

// Generate batch options from 1995 to current year - 3
const generateBatchOptions = () => {
    const currentYear = new Date().getFullYear()
    const batchOptions = []
    for (let year = 1995; year <= currentYear - 3; year++) {
        batchOptions.push({
            id: year,
            value: year.toString(),
            label: year.toString(),
        })
    }
    return batchOptions
}

const batchOptions = generateBatchOptions()

// Define the type for jsPDF with autoTable

const HigherEducationComponent = () => {
    const {
        fetchHigherEducation,
        isLoading,
        error,
        filters,
        setFilters,
        resetFilters,
        paginatedData,
        totalPages,
        currentPage,
        setCurrentPage,
        setItemsPerPage,
    } = useHigherEducationStore()

    const [itemsPerPageValue, setItemsPerPageValue] = useState("10")

    useEffect(() => {
        fetchHigherEducation(filters.department, filters.batch)
    }, [fetchHigherEducation, filters.department, filters.batch])

    // Handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Handle items per page change
    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPageValue(value)
        setItemsPerPage(Number.parseInt(value))
    }

    const generatePDF = () => {
        try {
            const doc = new jsPDF()
            // Get data from the store state instead of calling fetchHigherEducation
            const typedData = useHigherEducationStore.getState().data

            // Add title
            doc.setFontSize(16)
            doc.text("Higher Education Report", 14, 15)

            // Add filters information if present
            let yPos = 25

            doc.setFontSize(12)
            // doc.text("Applied Filters:", 14, yPos)

            if (filters.department) {
                doc.text(`Department: ${filters.department}`, 14, yPos)
                yPos += 7
            } else {
                doc.text(`Department: All Departments`, 14, yPos)
                yPos += 7
            }

            if (filters.batch) {
                doc.text(`Batch: ${filters.batch}`, 14, yPos)
                yPos += 7
            } else {
                doc.text(`Batch: All Batches`, 14, yPos)
                yPos += 7
            }

            yPos += 5

            // Generate table data
            const tableColumn = [
                "Name",
                "Department",
                "Batch",
                "Course",
                "Institution",
                "Location",
                "Start Year",
                "End Year",
            ]

            const tableRows = typedData.map((item) => [
                item.fullName,
                item.department,
                item.batch,
                item.course,
                item.institutionName,
                item.location,
                item.startYear,
                item.endYear || "Ongoing",
            ])

            // Generate the table - using autoTable directly, not as a method of doc
            autoTable(doc, {
                startY: yPos,
                head: [tableColumn],
                body: tableRows,
                theme: "striped",
                headStyles: { fillColor: [51, 51, 51] },
            })

            // Save the PDF
            doc.save("higher-education-report.pdf")
        } catch (error) {
            console.error("Error generating PDF:", error)
        }
    }
    // Safely get paginated data with null check
    const safelyGetPaginatedData = () => {
        try {
            return paginatedData() || []
        } catch (error) {
            console.error("Error getting paginated data:", error)
            return []
        }
    }

    // Safely get total pages with null check
    const safelyGetTotalPages = () => {
        try {
            return totalPages() || 1
        } catch (error) {
            console.error("Error getting total pages:", error)
            return 1
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-0 rounded-md shadow-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-semibold font-philosopher  text-xl overflow-hidden whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Higher Education Records
                            </h1>
                            <CardDescription>
                                View and download higher education data of
                                students
                            </CardDescription>
                        </div>
                        <Button
                            onClick={generatePDF}
                            className="flex items-center gap-2"
                        >
                            <Download size={16} />
                            Export PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="mb-6 grid gap-4 md:grid-cols-4">
                        <div>
                            <Select
                                value={filters.department}
                                onValueChange={(value) =>
                                    setFilters({ department: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Departments
                                    </SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem
                                            key={dept.id}
                                            value={dept.value}
                                        >
                                            {dept.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select
                                value={filters.batch}
                                onValueChange={(value) =>
                                    setFilters({ batch: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Batches
                                    </SelectItem>
                                    {batchOptions.map((batch) => (
                                        <SelectItem
                                            key={batch.id}
                                            value={batch.value}
                                        >
                                            {batch.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    fetchHigherEducation(
                                        filters.department,
                                        filters.batch
                                    )
                                }
                                disabled={isLoading}
                                className="flex items-center gap-2"
                            >
                                <Filter size={16} />
                                Apply Filters
                            </Button>
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                disabled={isLoading}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Reset
                            </Button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {/* Loading state */}
                    {isLoading ? (
                        <div className="py-6 text-center">
                            Loading higher education data...
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Full Name</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>Batch</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>
                                                Institution Name
                                            </TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Start Year</TableHead>
                                            <TableHead>End Year</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {safelyGetPaginatedData().length > 0 ? (
                                            safelyGetPaginatedData().map(
                                                (education, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {education.fullName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                education.department
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {education.batch}
                                                        </TableCell>
                                                        <TableCell>
                                                            {education.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            {education.course}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                education.institutionName
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {education.location}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                education.startYear
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {education.endYear
                                                                ? education.endYear
                                                                : "Ongoing"}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={9}
                                                    className="text-center py-6"
                                                >
                                                    No higher education records
                                                    found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-500">
                                        Items per page
                                    </p>
                                    <Select
                                        value={itemsPerPageValue}
                                        onValueChange={handleItemsPerPageChange}
                                    >
                                        <SelectTrigger className="w-20">
                                            <SelectValue placeholder="10" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5</SelectItem>
                                            <SelectItem value="10">
                                                10
                                            </SelectItem>
                                            <SelectItem value="25">
                                                25
                                            </SelectItem>
                                            <SelectItem value="50">
                                                50
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from(
                                            { length: safelyGetTotalPages() },
                                            (_, i) => i + 1
                                        )
                                            .filter(
                                                (page) =>
                                                    page === 1 ||
                                                    page ===
                                                        safelyGetTotalPages() ||
                                                    (page >= currentPage - 1 &&
                                                        page <= currentPage + 1)
                                            )
                                            .map((page, index, array) => (
                                                <div key={page}>
                                                    {index > 0 &&
                                                        array[index - 1] !==
                                                            page - 1 && (
                                                            <span className="px-2">
                                                                ...
                                                            </span>
                                                        )}
                                                    <Button
                                                        variant={
                                                            currentPage === page
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="icon"
                                                        className="w-8 h-8"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page
                                                            )
                                                        }
                                                    >
                                                        {page}
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={
                                            currentPage ===
                                            safelyGetTotalPages()
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default HigherEducationComponent
