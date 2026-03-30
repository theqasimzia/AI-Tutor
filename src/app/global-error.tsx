"use client"

import { useEffect } from "react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Global error:", error)
    }, [error])

    return (
        <html lang="en">
            <body className="min-h-screen flex items-center justify-center bg-slate-50" style={{ fontFamily: "'Outfit', system-ui, sans-serif" }}>
                <div className="text-center space-y-6 p-8 max-w-md">
                    <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                        <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Something went wrong</h1>
                        <p className="text-slate-500 text-lg">We&apos;re sorry, an unexpected error occurred. Please try again.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-200 hover:opacity-90 transition-opacity"
                        >
                            Try Again
                        </button>
                        <a
                            href="/"
                            className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </body>
        </html>
    )
}
