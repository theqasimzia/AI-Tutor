"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Home, LayoutDashboard, RotateCcw } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("App error:", error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="max-w-lg w-full border-0 shadow-xl">
                <CardContent className="pt-10 pb-8 px-8 text-center space-y-6">
                    <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900">Oops! Something went wrong</h1>
                        <p className="text-slate-500">
                            {process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred. Please try again."}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button onClick={() => reset()} className="gap-2">
                            <RotateCcw className="h-4 w-4" /> Try Again
                        </Button>
                        <Link href="/parent/dashboard">
                            <Button variant="outline" className="gap-2">
                                <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost" className="gap-2">
                                <Home className="h-4 w-4" /> Go Home
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
