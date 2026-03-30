"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    Activity,
    Bell,
    ShieldCheck
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { name: "Overview", href: "/parent/dashboard", icon: LayoutDashboard },
    { name: "Children & Progress", href: "/parent/children", icon: Users },
    { name: "Subscription & Billing", href: "/parent/subscription", icon: CreditCard },
    { name: "Account Settings", href: "/parent/settings", icon: Settings },
]

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

    const userName = session?.user?.name || "Parent"
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
                    "fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/50">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            Parent Portal
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
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-900/20"
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* User Profile Snippet */}
                <div className="p-4 border-t border-slate-800 m-4 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 font-bold">
                            {initials}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{userName}</p>
                            <p className="text-xs text-slate-400">Parent Account</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-slate-200 bg-white sticky top-0 z-30 flex items-center justify-between px-6 md:px-10">
                    <button
                        className="md:hidden p-2 -ml-2 text-slate-600"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <h2 className="text-xl font-bold text-slate-800 hidden md:block">
                        {sidebarItems.find(i => i.href === pathname)?.name || "Dashboard"}
                    </h2>

                    <div className="flex items-center gap-4 ml-auto">
                        <Button size="icon" variant="ghost" className="rounded-full text-slate-400 hover:text-slate-600 relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                        </Button>
                        <Button variant="outline" className="gap-2 hidden sm:flex">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">System Operational</span>
                        </Button>
                    </div>
                </header>

                <div className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
