import { format } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { TimePicker } from "./time-picker"

export function DateTimePicker({
    value,
    onChange,
    className,
    error,
}: {
    value: Date
    onChange: (date: Date | undefined) => void
    className?: string
    error?: string
}) {
    const [date, setDate] = useState<Date | undefined>(value)

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate)
        onChange(newDate)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className,
                        error && "border-red-500"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "MM/dd/yyyy HH:mm")
                    ) : (
                        <span>Pick a date and time</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="flex gap-4 p-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => handleDateChange(d)}
                        initialFocus
                    />
                    <div className="flex flex-col gap-2">
                        <TimePicker
                            setDate={handleDateChange}
                            date={date}
                            className="mt-[6px]"
                        />
                        <div className="flex items-center gap-2 text-sm">
                            <ClockIcon className="h-4 w-4" />
                            <Input
                                type="time"
                                value={date ? format(date, "HH:mm") : ""}
                                onChange={(e) => {
                                    const [hours, minutes] =
                                        e.target.value.split(":")
                                    const newDate = date
                                        ? new Date(date)
                                        : new Date()
                                    newDate.setHours(parseInt(hours))
                                    newDate.setMinutes(parseInt(minutes))
                                    handleDateChange(newDate)
                                }}
                                className="w-24"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
