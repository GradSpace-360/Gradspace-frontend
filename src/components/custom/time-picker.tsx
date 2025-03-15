// import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function TimePicker({
    date,
    setDate,
    className,
}: {
    date?: Date
    setDate: (date: Date | undefined) => void
    className?: string
}) {
    const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5)
    const hours = date?.getHours() || 0
    const minutes = date?.getMinutes() || 0

    return (
        <div className={cn("flex gap-1", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-16">
                        {hours.toString().padStart(2, "0")}
                        <ChevronDownIcon className="ml-1 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="h-48 overflow-y-auto">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <DropdownMenuItem
                            key={i}
                            onSelect={() => {
                                const newDate = date
                                    ? new Date(date)
                                    : new Date()
                                newDate.setHours(i)
                                setDate(newDate)
                            }}
                        >
                            {i.toString().padStart(2, "0")}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <span className="flex items-center">:</span>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-16">
                        {minutes.toString().padStart(2, "0")}
                        <ChevronDownIcon className="ml-1 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="h-48 overflow-y-auto">
                    {minuteOptions.map((m) => (
                        <DropdownMenuItem
                            key={m}
                            onSelect={() => {
                                const newDate = date
                                    ? new Date(date)
                                    : new Date()
                                newDate.setMinutes(m)
                                setDate(newDate)
                            }}
                        >
                            {m.toString().padStart(2, "0")}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
