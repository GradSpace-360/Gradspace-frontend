import { zodResolver } from "@hookform/resolvers/zod"
import { FC } from "react"
import { useForm } from "react-hook-form"
import { BarLoader } from "react-spinners"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useCompanyStore } from "@/store/user/company"

const schema = z.object({
    name: z.string().min(1, { message: "Company name is required" }),
    logo: z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Logo is required")
        .refine(
            (files) =>
                ["image/jpeg", "image/png", "image/svg+xml"].includes(
                    files[0]?.type
                ),
            "Only JPEG/PNG/SVG images are allowed"
        ),
})

type FormData = z.infer<typeof schema>

interface AddCompanyDrawerProps {
    onCompanyCreated?: () => void
}

const AddCompanyDrawer: FC<AddCompanyDrawerProps> = ({ onCompanyCreated }) => {
    const { createCompany, isLoading, error } = useCompanyStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    })
    const onSubmit = async (data: FormData) => {
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("logo", data.logo[0])

        await createCompany(formData)
        reset()
        if (onCompanyCreated) {
            onCompanyCreated()
        }
    }

    return (
        <Drawer>
            <DrawerTrigger id="add-company-trigger" asChild>
                <div />
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add a New Company</DrawerTitle>
                </DrawerHeader>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 p-4 pb-0"
                >
                    <Input placeholder="Company name" {...register("name")} />
                    {errors.name && (
                        <p className="text-red-500">{errors.name.message}</p>
                    )}

                    <Input
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        {...register("logo")}
                    />
                    {errors.logo && (
                        <p className="text-red-500">{errors.logo.message}</p>
                    )}

                    <Button
                        type="submit"
                        variant="destructive"
                        className="w-40"
                    >
                        Add Company
                    </Button>
                </form>
                <DrawerFooter>
                    {error && <p className="text-red-500">{error}</p>}
                    {isLoading && <BarLoader width={"100%"} color="#36d7b7" />}
                    <DrawerClose asChild>
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default AddCompanyDrawer
