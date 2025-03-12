import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    isSameMonth,
    parseISO,
    startOfMonth,
    subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Grid3X3, LayoutList } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/user/event"

interface CalendarViewProps {
    events: Event[]
    onEventClick: (event: Event) => void
}

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [view, setView] = useState<"month" | "list">("month")

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    // Group events by date for the month view
    const eventsByDate = daysInMonth.map((day) => {
        const dayEvents = events.filter((event) => {
            const startDate = parseISO(event.start_date_time)
            return isSameDay(day, startDate)
        })
        return { day, events: dayEvents }
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-bold">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={view === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setView("month")}
                    >
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        Month
                    </Button>
                    <Button
                        variant={view === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setView("list")}
                    >
                        <LayoutList className="h-4 w-4 mr-2" />
                        List
                    </Button>
                </div>
            </div>

            {view === "month" ? (
                <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                            <div
                                key={day}
                                className="text-center font-medium py-2"
                            >
                                {day}
                            </div>
                        )
                    )}

                    {/* Calendar days */}
                    {eventsByDate.map(({ day, events }) => (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[100px] border rounded-md p-1 transition-colors",
                                isSameMonth(day, currentMonth)
                                    ? "bg-card"
                                    : "bg-muted/50 text-muted-foreground",
                                events.length > 0 && "ring-1 ring-primary/20"
                            )}
                        >
                            <div className="text-right text-sm font-medium p-1">
                                {format(day, "d")}
                            </div>
                            <div className="space-y-1 mt-1 max-h-[80px] overflow-y-auto">
                                {events.slice(0, 3).map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => onEventClick(event)}
                                        className="text-xs p-1 rounded bg-primary/10 hover:bg-primary/20 cursor-pointer truncate"
                                    >
                                        <div className="font-medium truncate">
                                            {event.title}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge
                                                variant={
                                                    event.is_registration_open
                                                        ? "default"
                                                        : "destructive"
                                                }
                                                className="text-[10px] h-4"
                                            >
                                                {event.is_registration_open
                                                    ? "Open"
                                                    : "Closed"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {events.length > 3 && (
                                    <div className="text-xs text-center text-muted-foreground">
                                        +{events.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {daysInMonth
                        .map((day) => {
                            const dayEvents = events.filter((event) => {
                                const startDate = parseISO(
                                    event.start_date_time
                                )
                                return isSameDay(day, startDate)
                            })

                            if (dayEvents.length === 0) return null

                            return (
                                <div
                                    key={day.toString()}
                                    className="border rounded-lg overflow-hidden"
                                >
                                    <div className="bg-muted p-2 font-medium">
                                        {format(day, "EEEE, MMMM d, yyyy")}
                                    </div>
                                    <div className="divide-y">
                                        {dayEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className="p-3 hover:bg-muted/50 cursor-pointer"
                                                onClick={() =>
                                                    onEventClick(event)
                                                }
                                            >
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-medium">
                                                        {event.title}
                                                    </h3>
                                                    <Badge
                                                        variant={
                                                            event.is_registration_open
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                    >
                                                        {event.is_registration_open
                                                            ? "Open"
                                                            : "Closed"}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    {format(
                                                        parseISO(
                                                            event.start_date_time
                                                        ),
                                                        "h:mm a"
                                                    )}{" "}
                                                    -{" "}
                                                    {format(
                                                        parseISO(
                                                            event.end_date_time
                                                        ),
                                                        "h:mm a"
                                                    )}
                                                </div>
                                                <div className="text-sm mt-1">
                                                    {event.venue}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                        .filter(Boolean)}
                </div>
            )}
        </div>
    )
}
