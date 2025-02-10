/**
 * CustomTooltip Component
 *
 * This component renders a customized tooltip for the analytics charts to enhance user experience.
 *
 * Props:
 * - active: boolean indicating if the tooltip is active.
 * - payload: array containing tooltip data.
 * - label: the label for the tooltip.
 *
 * Features:
 * - Displays a styled container with label and corresponding data entries.
 * - Handles multiple data entries with dynamic colors.
 * - Responsive design for various screen sizes.
 **/

import { TooltipProps } from "recharts"
import {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent"
export const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-lg shadow-lg p-4">
                <p className="font-semibold text-foreground dark:text-foreground-dark">
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <p
                        key={`tooltip-${index}`}
                        style={{ color: entry.color }}
                        className="text-sm text-foreground dark:text-foreground-dark"
                    >
                        {`${entry.name}: ${entry.value}`}
                    </p>
                ))}
            </div>
        )
    }

    return null
}
