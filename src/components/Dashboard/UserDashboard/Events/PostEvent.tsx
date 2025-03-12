import { zodResolver } from "@hookform/resolvers/zod"
import MDEditor from "@uiw/react-md-editor"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Navigate, useNavigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { z } from "zod"

import { DateTimePicker } from "@/components/custom/DateTimePicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/context/ThemProvider"
import { useAuthStore } from "@/store/auth"
import { useEventStore } from "@/store/user/event"

const schema = z
    .object({
        title: z
            .string()
            .min(5, { message: "Title must be at least 5 characters" }),
        description: z
            .string()
            .min(20, { message: "Description must be at least 20 characters" }),
        venue: z.string().min(1, { message: "Venue is required" }),
        event_type: z.enum(["ALUM_EVENT", "CAMPUS_EVENT"]),
        register_link: z.string().url().optional().or(z.literal("")),
        start_date_time: z
            .string()
            .min(1, { message: "Start date is required" }),
        end_date_time: z.string().min(1, { message: "End date is required" }),
    })
    .superRefine((data, ctx) => {
        const start = new Date(data.start_date_time)
        const end = new Date(data.end_date_time)

        // Validate that end is after start.
        // If both dates are on the same day, give a specific error message.
        if (end <= start) {
            if (start.toDateString() === end.toDateString()) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "For events on the same day, the end time must be later than the start time",
                    path: ["end_date_time"],
                })
            } else {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "End date/time must be later than start date/time",
                    path: ["end_date_time"],
                })
            }
        }
    })

type FormData = z.infer<typeof schema>

const PostEvent = () => {
    const { user } = useAuthStore()
    const { theme } = useTheme()
    const {
        isLoading: creatingEvent,
        error: eventError,
        createEvent,
    } = useEventStore()
    const navigate = useNavigate()
    const {
        control,
        handleSubmit,
        formState: { errors },
        register,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            event_type: "ALUM_EVENT",
            register_link: "",
        },
    })
    const formatDateWithOffset = (date: Date): string => {
        const pad = (n: number) => n.toString().padStart(2, "0")
        const year = date.getFullYear()
        const month = pad(date.getMonth() + 1)
        const day = pad(date.getDate())
        const hours = pad(date.getHours())
        const minutes = pad(date.getMinutes())
        const tzOffset = -date.getTimezoneOffset()
        const sign = tzOffset >= 0 ? "+" : "-"
        const absOffset = Math.abs(tzOffset)
        return `${year}-${month}-${day}T${hours}:${minutes}:00${sign}${pad(Math.floor(absOffset / 60))}:${pad(absOffset % 60)}`
    }

    const onSubmit = async (data: FormData) => {
        try {
            await createEvent({
                ...data,
                start_date_time: new Date(data.start_date_time).toISOString(),
                end_date_time: new Date(data.end_date_time).toISOString(),
            })
            toast.success("Event created successfully!")
            navigate("/dashboard/events")
        } catch (error) {
            toast.error("Failed to create event")
            console.error("Event creation failed:", error)
        }
    }

    if (user?.role !== "Alumni" && user?.role !== "Faculty") {
        return <Navigate to="/dashboard/event-portal" />
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6 p-4">
            <div className="space-y-2">
                <h1 className="font-bold text-2xl font-philosopher whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Create New Event
                </h1>
                <p className="text-muted-foreground">
                    Fill in the details below to list a new event
                </p>
            </div>

            <Separator />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                            id="title"
                            placeholder="Annual Alumni Meet"
                            {...register("title")}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">Event Description</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                            You can use Markdown to format your description.{" "}
                            <a
                                href="https://www.markdownguide.org/basic-syntax/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline sm:inline block"
                            >
                                Learn Markdown syntax here.
                            </a>
                        </p>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <MDEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    height={250}
                                    data-color-mode={
                                        theme === "dark" ? "dark" : "light"
                                    }
                                />
                            )}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Label>Venue</Label>
                            <Input
                                placeholder="Event location"
                                {...register("venue")}
                            />
                            {errors.venue && (
                                <p className="text-sm text-destructive">
                                    {errors.venue.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <Label>Event Type</Label>
                            <Controller
                                name="event_type"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALUM_EVENT">
                                                Alumni Event
                                            </SelectItem>
                                            <SelectItem value="CAMPUS_EVENT">
                                                Campus Event
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                            <Label>Start Date & Time</Label>
                            {/* <Input
                                type="datetime-local"
                                {...register("start_date_time")}
                            />
                            {errors.start_date_time && (
                                <p className="text-sm text-destructive">
                                    {errors.start_date_time.message}
                                </p>
                            )} */}
                            <Controller
                                control={control}
                                name="start_date_time"
                                render={({ field }) => (
                                    <DateTimePicker
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                : new Date()
                                        }
                                        onChange={(date?: Date) => {
                                            field.onChange(
                                                date
                                                    ? formatDateWithOffset(date)
                                                    : ""
                                            )
                                        }}
                                        error={errors.start_date_time?.message}
                                    />
                                )}
                            />
                            {errors.start_date_time && (
                                <p className="text-sm text-destructive">
                                    {errors.start_date_time.message}
                                </p>
                            )}
                        </div>

                        <div className="flex-1">
                            <Label>End Date & Time</Label>
                            <Controller
                                control={control}
                                name="end_date_time"
                                render={({ field }) => (
                                    <DateTimePicker
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                : new Date()
                                        }
                                        onChange={(date?: Date) => {
                                            field.onChange(
                                                date
                                                    ? formatDateWithOffset(date)
                                                    : ""
                                            )
                                        }}
                                        error={errors.end_date_time?.message}
                                    />
                                )}
                            />
                            {errors.end_date_time && (
                                <p className="text-sm text-destructive">
                                    {errors.end_date_time.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="register_link">
                            Registration Link (Optional)
                        </Label>
                        <Input
                            id="register_link"
                            placeholder="https://example.com/register"
                            {...register("register_link")}
                        />
                        {errors.register_link && (
                            <p className="text-sm text-destructive">
                                {errors.register_link.message}
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                    {eventError && (
                        <p className="text-sm text-destructive">{eventError}</p>
                    )}
                    {creatingEvent && (
                        <BarLoader className="w-full" color="#36d7b7" />
                    )}
                    <Button type="submit" className="w-full" size="lg">
                        Publish Event
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PostEvent
