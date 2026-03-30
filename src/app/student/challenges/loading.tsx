import { Skeleton } from "@/components/ui/skeleton"

export default function ChallengesLoading() {
    return (
        <div className="space-y-10">
            {/* XP/Level banner */}
            <Skeleton className="h-48 w-full rounded-3xl" />

            {/* Badges section */}
            <div className="space-y-6">
                <Skeleton className="h-8 w-44" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-40 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="space-y-6">
                <Skeleton className="h-8 w-52" />
                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-100 last:border-0">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-5 w-32 flex-1" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
