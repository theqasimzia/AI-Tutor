import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-10 w-52" />

            {/* Tabs */}
            <Skeleton className="h-11 w-full rounded-full" />

            {/* Profile card */}
            <div className="rounded-xl border border-slate-200 p-6 space-y-6">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-32 rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <Skeleton className="h-10 w-32 rounded-md" />
            </div>
        </div>
    )
}
