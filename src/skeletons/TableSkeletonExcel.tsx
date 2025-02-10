import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const TableSkeletonExcel = () => {
    return (
        <div className="rounded-lg border overflow-x-auto shadow-sm">
            <Table className="min-w-full">
                <TableHeader className="bg-gray-50 dark:bg-[#262626]">
                    <TableRow>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                            <Skeleton className="h-4 w-[100px]" />
                        </TableHead>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                            <Skeleton className="h-4 w-[100px]" />
                        </TableHead>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                            <Skeleton className="h-4 w-[100px]" />
                        </TableHead>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                            <Skeleton className="h-4 w-[100px]" />
                        </TableHead>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                            <Skeleton className="h-4 w-[100px]" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-4 w-[120px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[120px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[180px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[80px]" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default TableSkeletonExcel
