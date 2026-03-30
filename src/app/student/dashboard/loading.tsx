import { Skeleton } from "@/components/ui/skeleton"

export default function StudentDashboardLoading() {
    return (
        <div className="space-y-10">
            {/* Welcome banner */}
            <Skeleton className="h-48 w-full rounded-3xl" />

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                        ))}
                    </div>
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-72 rounded-3xl" />
                    <Skeleton className="h-48 rounded-3xl" />
                </div>
            </div>
        </div>
    )
}
