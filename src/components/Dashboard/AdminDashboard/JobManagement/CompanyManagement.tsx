import { zodResolver } from "@hookform/resolvers/zod"
import { Search } from "lucide-react"
import { FC, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { BarLoader } from "react-spinners"
import { z } from "zod"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { axiosPrivate } from "@/config/axiosInstance"
import { useCompanyStore } from "@/store/user/company"

// Define proper Company interface based on your models
interface BaseModel {
    ID: string
    CreatedAt: string
    UpdatedAt: string
}

interface Company extends BaseModel {
    Name: string
    LogoURL: string | null
}

// Form schema for adding/updating company
const companyFormSchema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z
        .instanceof(FileList)
        .optional()
        .refine(
            (files) =>
                !files ||
                files.length === 0 ||
                ["image/jpeg", "image/png", "image/svg+xml"].includes(
                    files[0]?.type
                ),
            "Only JPEG/PNG/SVG images are allowed"
        ),
})

type CompanyFormValues = z.infer<typeof companyFormSchema>

const CompanyManagement: FC = () => {
    const {
        companies,
        fetchCompanies,
        createCompany,
        updateCompany,
        deleteCompany,
        isLoading,
        error,
    } = useCompanyStore()

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

    // Add company form
    const addCompanyForm = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: "",
        },
    })

    // Update company form
    const updateCompanyForm = useForm<CompanyFormValues>({
        resolver: zodResolver(companyFormSchema),
        defaultValues: {
            name: "",
        },
    })

    // Fetch companies on component mount
    useEffect(() => {
        fetchCompanies()
    }, [fetchCompanies])

    // Reset update form when selected company changes
    useEffect(() => {
        if (selectedCompany) {
            updateCompanyForm.reset({
                name: selectedCompany.Name,
            })
        }
    }, [selectedCompany, updateCompanyForm])

    // Filter companies based on search term
    const filteredCompanies = companies.filter((company: Company) =>
        company.Name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Handle add company submission
    const onAddCompany = async (data: CompanyFormValues) => {
        const formData = new FormData()
        formData.append("name", data.name)

        if (data.logo && data.logo.length > 0) {
            formData.append("logo", data.logo[0])
        }

        await createCompany(formData)
        addCompanyForm.reset()
    }

    // Handle update company submission
    const onUpdateCompany = async (data: CompanyFormValues) => {
        if (!selectedCompany) return

        const formData = new FormData()
        formData.append("name", data.name)

        if (data.logo && data.logo.length > 0) {
            formData.append("logo", data.logo[0])
        }

        await updateCompany(selectedCompany.ID, formData)
        setIsUpdateDialogOpen(false)
    }

    // Handle company deletion
    const handleDeleteCompany = async (companyId: string) => {
        await deleteCompany(companyId)
    }

    // Open update dialog with selected company data
    const openUpdateDialog = (company: Company) => {
        setSelectedCompany(company)
        setIsUpdateDialogOpen(true)
    }

    return (
        <Card className="w-full border-none shadow-sm">
            <CardHeader className="p-0 mb-4">
                <CardDescription className="p-0 m-0">
                    Add, update, or remove companies from your platform
                </CardDescription>
            </CardHeader>

            <CardContent className="p-0 m-0">
                {/* Search and Add Section */}
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search companies..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add Company</Button>
                        </DialogTrigger>
                        <DialogContent showCloseButton={false}>
                            <form
                                onSubmit={addCompanyForm.handleSubmit(
                                    onAddCompany
                                )}
                            >
                                <DialogHeader>
                                    <DialogTitle>Add New Company</DialogTitle>
                                    <DialogDescription>
                                        Fill in the details to add a new company
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Company name"
                                            {...addCompanyForm.register("name")}
                                        />
                                        {addCompanyForm.formState.errors
                                            .name && (
                                            <p className="text-red-500 text-sm">
                                                {
                                                    addCompanyForm.formState
                                                        .errors.name.message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Input
                                            type="file"
                                            accept="image/png, image/jpeg, image/svg+xml"
                                            {...addCompanyForm.register("logo")}
                                        />
                                        {addCompanyForm.formState.errors
                                            .logo && (
                                            <p className="text-red-500 text-sm">
                                                {
                                                    addCompanyForm.formState
                                                        .errors.logo.message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    {error && (
                                        <p className="text-red-500 text-sm">
                                            {error}
                                        </p>
                                    )}
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading
                                            ? "Adding..."
                                            : "Add Company"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Loading indicator */}
                {isLoading && <BarLoader width={"100%"} color="#36d7b7" />}

                {/* Companies Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCompanies.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-6 text-gray-500"
                                >
                                    {searchTerm
                                        ? "No companies match your search"
                                        : "No companies added yet"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCompanies.map((company: Company) => (
                                <TableRow key={company.ID}>
                                    <TableCell>
                                        {company.LogoURL ? (
                                            <img
                                                src={`${axiosPrivate.defaults.baseURL}/${
                                                    company.LogoURL
                                                }`}
                                                alt={`${company.Name} logo`}
                                                className="h-10 w-10 object-contain"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 bg-gray-200 flex items-center justify-center rounded">
                                                <span className="text-gray-500 text-xs">
                                                    No logo
                                                </span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {company.Name}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            company.CreatedAt
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                openUpdateDialog(company)
                                            }
                                        >
                                            Edit
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be
                                                        undone. This will
                                                        permanently delete the
                                                        company "{company.Name}"
                                                        and all associated data.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteCompany(
                                                                company.ID
                                                            )
                                                        }
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>

            <CardFooter className="justify-between">
                <div className="text-sm text-gray-500">
                    Total companies: {filteredCompanies.length}
                </div>
            </CardFooter>

            {/* Update Company Dialog */}
            <Dialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
            >
                <DialogContent showCloseButton={false}>
                    <form
                        onSubmit={updateCompanyForm.handleSubmit(
                            onUpdateCompany
                        )}
                    >
                        <DialogHeader>
                            <DialogTitle>Update Company</DialogTitle>
                            <DialogDescription>
                                Update the company information
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Company name"
                                    {...updateCompanyForm.register("name")}
                                />
                                {updateCompanyForm.formState.errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {
                                            updateCompanyForm.formState.errors
                                                .name.message
                                        }
                                    </p>
                                )}
                            </div>

                            {selectedCompany?.LogoURL && (
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={`${axiosPrivate.defaults.baseURL}/${
                                            selectedCompany.LogoURL
                                        }`}
                                        alt="Current logo"
                                        className="h-12 w-12 object-contain"
                                    />
                                    <span className="text-sm text-gray-500">
                                        Current logo
                                    </span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Input
                                    type="file"
                                    accept="image/png, image/jpeg, image/svg+xml"
                                    {...updateCompanyForm.register("logo")}
                                />
                                <p className="text-sm text-gray-500">
                                    Leave empty to keep the current logo
                                </p>
                                {updateCompanyForm.formState.errors.logo && (
                                    <p className="text-red-500 text-sm">
                                        {
                                            updateCompanyForm.formState.errors
                                                .logo.message
                                        }
                                    </p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsUpdateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Company"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default CompanyManagement
