import { Skeleton } from "@/components/ui/skeleton"

export const LoadingSkeleton = ({ className }: { className?: string }) => (
    <Skeleton className={className} />
)

export const ChartLoadingSkeleton = () => (
    <LoadingSkeleton className="h-[300px] w-full" />
)
