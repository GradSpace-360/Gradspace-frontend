import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const JobLoadingSkeleton = () => {
    return (
        <Card className="flex flex-col animate-pulse">
            <CardHeader className="flex">
                <div className="w-full flex justify-between items-center">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex justify-between">
                    <Skeleton className="h-6 w-20" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>

                <Skeleton className="h-px w-full" />

                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
            </CardFooter>
        </Card>
    )
}

export default JobLoadingSkeleton
