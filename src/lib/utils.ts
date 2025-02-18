import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Formats a date provided in "YYYY-MM-DD" format or as a Date object to "Mon YYYY".
 * For example: "2025-02-01" => "Feb 2025"
 *
 * @param dateInput - A date string in "YYYY-MM-DD" format or a Date object.
 * @returns The formatted date string.
 */
export default function formatDate(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
    if (isNaN(date.getTime())) return "Invalid Date"

    return date.toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
    })
}
