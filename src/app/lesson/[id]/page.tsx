"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MoreVertical, Settings, Mic, MessageSquare, Maximize2, X, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { VoiceTutor } from "@/components/voice-tutor"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const [isFullscreen, setIsFullscreen] = useState(false)

    const lessonTitle = params.id?.toString().replace(/-/g, ' ') || "Overview"

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => setIsFullscreen(true))
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => setIsFullscreen(false))
            }
        }
    }

    const endLesson = () => {
        router.push("/student/dashboard")
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-slate-50 to-slate-50 -z-10" />

            {/* Immersive Header */}
            <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={endLesson}>
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="font-bold text-slate-800 capitalize text-lg leading-tight">{lessonTitle}</h1>
                        <p className="text-xs text-slate-500 font-medium">Mathematics • KS2 • Level 4</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full mr-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        AI Tutor Active
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-slate-900">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Lesson Settings</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 space-y-4">
                                <p className="text-sm text-slate-500">Configure your learning experience.</p>
                                <Button variant="outline" className="w-full justify-start">Accessibility Options</Button>
                                <Button variant="outline" className="w-full justify-start">Voice Speed: Normal</Button>
                                <Button variant="outline" className="w-full justify-start">Show Transcripts: On</Button>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:text-slate-900 hidden sm:flex" onClick={toggleFullscreen}>
                        {isFullscreen ? <X className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full text-slate-500">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => alert("Report Issue")}>Report Issue</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert("View Transcript")}>View Transcript History</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={endLesson}>Exit Lesson</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="destructive" size="sm" className="hidden md:flex ml-2 rounded-full px-4 shadow-sm shadow-red-200" onClick={endLesson}>
                        End Lesson
                    </Button>
                </div>
            </header>

            {/* Main Focus Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
                {/* Connecting Lines / Visuals */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-200 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                </div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-4xl relative z-10"
                >
                    <VoiceTutor />
                </motion.div>
            </main>

            {/* Bottom Floating Bar (Progress/Quick Actions) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 z-20">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Mic className="h-4 w-4 text-violet-600" />
                    <span>Listening...</span>
                </div>
                <div className="h-4 w-[1px] bg-slate-300" />
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
                    <MessageSquare className="h-4 w-4" />
                    <span>Type Answer</span>
                </div>
            </div>
        </div>
    )
}
