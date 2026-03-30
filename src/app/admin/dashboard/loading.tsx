import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-6 space-y-3">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>

            {/* Recent signups table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <Skeleton className="h-6 w-36" />
                </div>
                <div className="divide-y divide-slate-100">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center px-6 py-4 gap-6">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-10 ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
