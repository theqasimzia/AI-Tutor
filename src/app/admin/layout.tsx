"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    LogOut,
    Menu,
    ShieldAlert
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Curriculum", href: "/admin/curriculum", icon: BookOpen },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Admin Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/50">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Admin Panel
                        </span>
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 py-6 px-3 space-y-1">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative text-sm font-medium",
                                        isActive
                                            ? "bg-red-600 text-white shadow-md shadow-red-900/20"
                                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <Link href="/login">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-900 hover:text-red-400 transition-colors cursor-pointer">
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-medium">Sign Out</span>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 -ml-2 text-slate-600"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800">
                            {sidebarItems.find(i => i.href === pathname)?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            AD
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
