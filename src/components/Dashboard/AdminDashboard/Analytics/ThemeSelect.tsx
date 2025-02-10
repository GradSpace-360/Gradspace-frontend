import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { colorThemes } from "./ColorThemes"

export const ThemeSelect = ({
    selectedTheme,
    onThemeChange,
}: {
    selectedTheme: string
    onThemeChange: (value: string) => void
}) => (
    <Select
        value={selectedTheme}
        onValueChange={onThemeChange}
        aria-label="Select Theme"
    >
        <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Theme" />
        </SelectTrigger>
        <SelectContent>
            {Object.keys(colorThemes).map((theme) => (
                <SelectItem key={theme} value={theme}>
                    {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
)
