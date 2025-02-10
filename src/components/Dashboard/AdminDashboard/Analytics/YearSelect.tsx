import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const YearSelect = ({
    selectedStartYear,
    onYearChange,
    yearOptions,
}: {
    selectedStartYear: number
    onYearChange: (value: string) => void
    yearOptions: number[]
}) => (
    <Select
        value={selectedStartYear.toString()}
        onValueChange={onYearChange}
        aria-label="Select Year Range"
    >
        <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Year Range" />
        </SelectTrigger>
        <SelectContent>
            {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                    {`${year}-${year + 5}`}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
)
