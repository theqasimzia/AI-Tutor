import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-10 w-52" />
                <Skeleton className="h-5 w-64" />
            </div>

            {/* Personal info section */}
            <div className="space-y-4">
                <Skeleton className="h-7 w-48" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
                <Skeleton className="h-10 w-32 rounded-md" />
            </div>

            <Skeleton className="h-[1px] w-full" />

            {/* Notifications section */}
            <div className="space-y-4">
                <Skeleton className="h-7 w-32" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-44" />
                            <Skeleton className="h-3 w-72" />
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    )
}
