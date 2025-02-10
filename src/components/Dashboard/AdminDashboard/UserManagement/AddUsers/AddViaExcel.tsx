/**
 * AddViaExcel Component
 *
 * This component allows administrators to bulk register users by uploading an Excel file.
 * The Excel file must follow a specific format with columns: Full Name, Batch, Department, Role, and Email.
 * The component validates the uploaded file, parses the data, and displays it in a table for review.
 * Users can then register the parsed data or cancel the operation.
 * Features:
 * - Download a sample Excel file for reference.
 * - Validate the uploaded Excel file for required columns and data integrity.
 * - Display parsed data in a table for review.
 * - Register multiple users in bulk via an API call.
 * - Cancel the operation and reset the form.
 */
import axios from "axios"
import { CloudUploadIcon, Trash2Icon } from "lucide-react"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { read, utils, write } from "xlsx"

import { Button } from "@/components/ui/button"
import {
    Dropzone,
    DropZoneArea,
    DropzoneDescription,
    DropzoneFileList,
    DropzoneFileListItem,
    DropzoneMessage,
    DropzoneRemoveFile,
    DropzoneTrigger,
    useDropzone,
} from "@/components/ui/dropzone"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { axiosPrivate } from "@/config/axiosInstance"
import TableSkeletonExcel from "@/skeletons/TableSkeletonExcel"
import { useAddUserStore } from "@/store/admin/addUserStore"

type DepartmentAbbreviation = "CSE" | "EEE" | "ECE" | "ME"

const departmentFullForms: { [key in DepartmentAbbreviation]: string } = {
    CSE: "Computer Science Engineering",
    EEE: "Electrical and Electronics Engineering",
    ECE: "Electronics and Communication Engineering",
    ME: "Mechanical Engineering",
}

interface User {
    fullName: string
    batch: number
    department: DepartmentAbbreviation
    role: "Student" | "Alumni" | "Faculty"
    email: string
}

type ExcelData = {
    "Full Name": string
    Batch: string
    Department: string
    Role: string
    Email: string
}[]
// sample file for reference
// const generateSampleExcel = () => {
//     const ws = utils.json_to_sheet([
//         { "Full Name": "", Batch: "", Department: "", Role: "", Email: "" },
//     ])
//     const wb = utils.book_new()
//     utils.book_append_sheet(wb, ws, "Users")
//     const excelBuffer = write(wb, { bookType: "xlsx", type: "array" })
//     const data = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     })
//     const url = window.URL.createObjectURL(data)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = "sample_user_data.xlsx"
//     link.click()
//     window.URL.revokeObjectURL(url)
// }
// some dummy data register.
const generateSampleExcel = () => {
    // Generate 20 student records
    const students = Array.from({ length: 20 }, (_, i) => {
        const studentNumber = i + 1
        return {
            "Full Name": `ElectronicsSt${studentNumber}`,
            Batch: "2020",
            Department: "ECE",
            Role: "Alumni",
            Email: `electronicstudent${studentNumber}@gmail.com`,
        }
    })

    // Create worksheet with student data
    const ws = utils.json_to_sheet(students)

    // Create workbook and append worksheet
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, "Users")

    // Generate Excel file and trigger download
    const excelBuffer = write(wb, { bookType: "xlsx", type: "array" })
    const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement("a")
    link.href = url
    link.download = "sample_user_data.xlsx"
    link.click()
    window.URL.revokeObjectURL(url)
}
const AddViaExcel: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { parsedExcelData, setParsedExcelData } = useAddUserStore()

    const dropzone = useDropzone({
        onDropFile: async (file: File) => {
            try {
                await parseExcel(file)
                return { status: "success", result: file }
            } catch (error) {
                return {
                    status: "error",
                    error:
                        error instanceof Error
                            ? error.message
                            : "Invalid file format",
                }
            }
        },
        validation: {
            accept: {
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    [".xlsx"],
                "application/vnd.ms-excel": [".xls"],
            },
            maxSize: 10 * 1024 * 1024,
            maxFiles: 1,
        },
    })

    const validateExcelData = (data: ExcelData) => {
        const errors: string[] = []
        const requiredColumns = [
            "Full Name",
            "Batch",
            "Department",
            "Role",
            "Email",
        ]
        const validRoles = ["Student", "Alumni", "Faculty"]
        const validDepartments = ["CSE", "EEE", "ECE", "ME"]

        if (data.length === 0) {
            throw new Error("The Excel file is empty.")
        }

        const columns = Object.keys(data[0] || {})
        const missingColumns = requiredColumns.filter(
            (col) => !columns.includes(col)
        )
        if (missingColumns.length > 0) {
            throw new Error(`Missing columns: ${missingColumns.join(", ")}`)
        }

        for (let i = 0; i < data.length; i++) {
            const row = data[i]
            if (
                !row["Full Name"] ||
                !row["Batch"] ||
                !row["Department"] ||
                !row["Role"] ||
                !row["Email"]
            ) {
                errors.push(`Row ${i + 1}: Missing required fields`)
            }
            if (!validRoles.includes(row["Role"])) {
                errors.push(`Row ${i + 1}: Invalid role "${row["Role"]}"`)
            }
            if (!validDepartments.includes(row["Department"])) {
                errors.push(
                    `Row ${i + 1}: Invalid department "${row["Department"]}"`
                )
            }
        }

        if (errors.length > 0) {
            throw new Error(errors.join("\n"))
        }
    }

    const parseExcel = async (file: File) => {
        setIsLoading(true)
        try {
            const rawData = await new Promise<ExcelData>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = (e) => {
                    try {
                        const buffer = new Uint8Array(
                            e.target?.result as ArrayBuffer
                        )
                        const workbook = read(buffer, { type: "array" })
                        const sheetName = workbook.SheetNames[0]
                        const worksheet = workbook.Sheets[sheetName]
                        resolve(utils.sheet_to_json(worksheet) as ExcelData)
                    } catch {
                        reject(new Error("Failed to parse Excel file"))
                    }
                }
                reader.readAsArrayBuffer(file)
            })

            validateExcelData(rawData)

            const jsonData: User[] = rawData.map((item) => ({
                fullName: item["Full Name"],
                batch: Number(item.Batch),
                department: item.Department as DepartmentAbbreviation,
                role: item.Role as "Student" | "Alumni" | "Faculty",
                email: item.Email,
            }))

            setParsedExcelData(jsonData)
        } catch (error) {
            setParsedExcelData([])
            if (error instanceof Error) {
                toast.error(
                    <div>
                        <p>Invalid Excel file:</p>
                        <pre className="whitespace-pre-wrap">
                            {error.message}
                        </pre>
                    </div>,
                    { duration: 5000 }
                )
            }
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async () => {
        setIsLoading(true)
        try {
            const dataToSend = parsedExcelData.map((user) => ({
                ...user,
                department: departmentFullForms[user.department],
            }))

            await axiosPrivate.post(
                "/admin/user-management/add-users/",
                dataToSend
            )
            toast.success("Users registered successfully")
            setParsedExcelData([])
            dropzone.removeAllFiles()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data.message || "Failed to register users"
                )
            } else {
                toast.error("An unexpected error occurred")
            }
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        setParsedExcelData([])
        dropzone.removeAllFiles()
    }

    return (
        <div className="space-y-4">
            <div className="bg-secondary dark:bg-[#262626] p-4 rounded-md">
                <h3 className="font-semibold mb-2">
                    Bulk User Registration via Excel
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    This feature allows you to register multiple users at once
                    by uploading an Excel file. The file must follow the
                    structure below:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <li>
                        <strong>Columns:</strong> Full Name, Batch, Department,
                        Role, Email
                    </li>
                    <li>
                        <strong>Possible values for Role:</strong> Student,
                        Alumni, Faculty
                    </li>
                    <li>
                        <strong>Possible values for Department:</strong> CSE,
                        EEE, ECE, ME
                    </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Note:</strong> Ensure the Excel file is correctly
                    formatted before uploading. Invalid data may result in
                    registration errors.
                </p>
            </div>
            <Button onClick={generateSampleExcel}>Download Sample Excel</Button>

            <div className="not-prose flex flex-col gap-4">
                <Dropzone {...dropzone}>
                    <div>
                        <div className="flex justify-between">
                            <DropzoneDescription>
                                Upload an Excel file
                            </DropzoneDescription>
                            <DropzoneMessage />
                        </div>
                        <DropZoneArea>
                            <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
                                <CloudUploadIcon className="size-8" />
                                <div>
                                    <p className="font-semibold">
                                        Upload Excel file
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Click here or drag and drop to upload
                                    </p>
                                </div>
                            </DropzoneTrigger>
                        </DropZoneArea>
                    </div>

                    <DropzoneFileList className="grid gap-3 p-0">
                        {dropzone.fileStatuses.map((file) => (
                            <DropzoneFileListItem
                                className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                                key={file.id}
                                file={file}
                            >
                                <div className="flex items-center justify-between p-2 pl-4">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm">
                                            {file.fileName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.file.size / 1024).toFixed(2)}{" "}
                                            KB
                                        </p>
                                    </div>
                                    <DropzoneRemoveFile
                                        variant="ghost"
                                        className="shrink-0 hover:outline"
                                        onClick={handleCancel}
                                    >
                                        <Trash2Icon className="size-4" />
                                    </DropzoneRemoveFile>
                                </div>
                            </DropzoneFileListItem>
                        ))}
                    </DropzoneFileList>
                </Dropzone>
            </div>

            {isLoading ? (
                <TableSkeletonExcel />
            ) : (
                parsedExcelData.length > 0 && (
                    <>
                        <div className="rounded-lg border overflow-x-auto shadow-sm">
                            <Table className="min-w-full">
                                <TableHeader className="bg-gray-50 dark:bg-[#262626]">
                                    <TableRow>
                                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                                            Full Name
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                                            Batch
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                                            Department
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                                            Role
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-700 dark:text-gray-300 border-b">
                                            Email
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedExcelData.map((user, index) => (
                                        <TableRow
                                            key={index}
                                            className="hover:bg-gray-50 dark:hover:bg-[#333] border-b"
                                        >
                                            <TableCell className="py-3 text-gray-700 dark:text-gray-300">
                                                {user.fullName}
                                            </TableCell>
                                            <TableCell className="py-3 text-gray-700 dark:text-gray-300">
                                                {user.batch}
                                            </TableCell>
                                            <TableCell className="py-3 text-gray-700 dark:text-gray-300">
                                                {
                                                    departmentFullForms[
                                                        user.department
                                                    ]
                                                }
                                            </TableCell>
                                            <TableCell className="py-3 text-gray-700 dark:text-gray-300">
                                                {user.role}
                                            </TableCell>
                                            <TableCell className="py-3 text-gray-700 dark:text-gray-300">
                                                {user.email}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex space-x-4">
                            <Button
                                onClick={handleRegister}
                                disabled={isLoading}
                            >
                                {isLoading ? "Registering..." : "Register"}
                            </Button>
                            <Button variant="outline" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </>
                )
            )}
        </div>
    )
}

export default AddViaExcel
