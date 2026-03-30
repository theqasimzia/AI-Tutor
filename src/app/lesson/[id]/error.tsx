"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, BookOpen, RotateCcw } from "lucide-react"

export default function LessonError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Lesson error:", error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <Card className="max-w-lg w-full border-0 shadow-xl border-t-4 border-t-violet-500">
                <CardContent className="pt-10 pb-8 px-8 text-center space-y-6">
                    <div className="mx-auto h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-violet-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-900">Couldn&apos;t load this lesson</h1>
                        <p className="text-slate-500">
                            {process.env.NODE_ENV === "development" ? error.message : "Something went wrong while loading the lesson. Please try again."}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button onClick={() => reset()} className="gap-2 bg-violet-600 hover:bg-violet-700">
                            <RotateCcw className="h-4 w-4" /> Try Again
                        </Button>
                        <Link href="/student/lessons">
                            <Button variant="outline" className="gap-2">
                                <BookOpen className="h-4 w-4" /> Return to Lessons
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
