import { Skeleton } from "@/components/ui/skeleton"

export default function ChildrenLoading() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-56" />
                    <Skeleton className="h-5 w-72" />
                </div>
                <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* Tabs */}
            <Skeleton className="h-11 w-72 rounded-xl" />

            {/* Subject bars card */}
            <div className="rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-3 w-full rounded-full" />
                    </div>
                ))}
            </div>

            {/* Lessons table card */}
            <div className="rounded-xl border border-slate-200 p-6 space-y-4">
                <Skeleton className="h-6 w-36" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-2 w-2 rounded-full" />
                            <Skeleton className="h-4 w-44" />
                        </div>
                        <div className="flex items-center gap-6">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
