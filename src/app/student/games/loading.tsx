import { Skeleton } from "@/components/ui/skeleton"

export default function GamesLoading() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-5 w-72" />
            </div>

            {/* Game cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
                        <Skeleton className="h-32 w-full rounded-none" />
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-5 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-6 w-36" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
