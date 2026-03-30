import { Skeleton } from "@/components/ui/skeleton"

export default function UsersLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                <Skeleton className="h-10 w-72 rounded-md" />
                <Skeleton className="h-10 w-24 rounded-md" />
            </div>

            {/* User table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                    <div className="flex gap-6">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-4 w-16 ml-auto" />
                    </div>
                </div>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center px-6 py-4 gap-6 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-5 w-28" />
                        </div>
                        <Skeleton className="h-5 w-44" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-14 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}
