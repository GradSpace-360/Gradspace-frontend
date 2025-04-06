import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSkeleton } from "@/skeletons"

export const MetricCard = ({
    title,
    value,
    icon: Icon,
    isLoading,
}: {
    title: string
    value: string | number
    icon: React.ElementType
    isLoading: boolean
}) => (
    <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-4">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-3 pt-0 px-4">
            {isLoading ? (
                <LoadingSkeleton className="h-4 w-full" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
        </CardContent>
    </Card>
)
