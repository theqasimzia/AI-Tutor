"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import {
    LayoutDashboard,
    BookOpen,
    Trophy,
    User,
    LogOut,
    Menu,
    Gamepad2,
    Settings,
    Sparkles
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "My Curriculum", href: "/student/lessons", icon: BookOpen },
    { name: "Game Center", href: "/student/games", icon: Gamepad2 },
    { name: "Achievements", href: "/student/challenges", icon: Trophy },
    { name: "Profile", href: "/student/profile", icon: User },
]

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

    const userName = session?.user?.name || "Student"
    const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Premium Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-xl shadow-slate-200/50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-900 tracking-tight">
                            AI Tutor
                        </span>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-violet-50 text-violet-700 font-semibold shadow-sm"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-violet-600 rounded-r-full"
                                        />
                                    )}
                                    <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* User Profile Snippet */}
                <div className="p-4 border-t border-slate-100 m-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-violet-100 border-2 border-white shadow-sm flex items-center justify-center text-violet-700 font-bold">
                            {initials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                            <p className="text-xs text-slate-500">Student</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 text-slate-500 border-slate-200 hover:bg-white hover:text-red-500 hover:border-red-100 transition-colors"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Decorative Background Blob */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                {/* Header */}
                <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-10">
                    <button
                        className="md:hidden p-2 -ml-2 text-slate-600"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="hidden md:flex items-center gap-6 mr-6">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Level</span>
                                <span className="text-sm font-bold text-slate-900">Level 4 Scholar</span>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200" />
                        </div>

                        <div className="flex items-center gap-3 bg-white border border-slate-200 shadow-sm px-4 py-1.5 rounded-full">
                            <div className="bg-amber-100 p-1.5 rounded-full">
                                <Trophy className="h-4 w-4 text-amber-600" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Total XP</span>
                                <span className="text-sm font-bold text-slate-900">1,250</span>
                            </div>
                        </div>

                        <Button size="icon" variant="ghost" className="rounded-full text-slate-400 hover:text-slate-600">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full z-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
