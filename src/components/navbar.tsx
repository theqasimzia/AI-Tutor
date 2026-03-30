"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Rocket, GraduationCap, Menu, X } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
    { name: "Features", href: "#features" },
    { name: "Curriculum", href: "#curriculum" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
]

const roleDashboardMap: Record<string, string> = {
    ADMIN: "/admin/dashboard",
    PARENT: "/parent/dashboard",
    STUDENT: "/student/dashboard",
}

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/signup")

    if (pathname?.startsWith("/student") || pathname?.startsWith("/parent") || pathname?.startsWith("/admin") || pathname?.startsWith("/lesson")) {
        return null
    }

    const dashboardUrl = session?.user?.role
        ? roleDashboardMap[session.user.role] || "/parent/dashboard"
        : "/parent/dashboard"

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/5 backdrop-blur-md supports-[backdrop-filter]:bg-background/5">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2 font-bold text-xl group">
                    <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-1.5 rounded-xl shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <span className="font-bold tracking-tight">AI Tutor Academy</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {!isAuthPage && navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {status === "authenticated" && session ? (
                        <>
                            <Link href={dashboardUrl}>
                                <Button variant="ghost" size="sm">
                                    Dashboard
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => signOut({ callbackUrl: "/login" })}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm" className="group">
                                    Get Started
                                    <Rocket className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden border-b bg-background p-4"
                >
                    <nav className="flex flex-col space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium transition-colors hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 pt-4 border-t">
                            {status === "authenticated" && session ? (
                                <>
                                    <Link href={dashboardUrl} onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            setIsOpen(false)
                                            signOut({ callbackUrl: "/login" })
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </motion.div>
            )}
        </header>
    )
}
