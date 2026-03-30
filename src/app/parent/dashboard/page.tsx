"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Activity, Clock, TrendingUp, Users, CheckCircle2, BookOpen, ArrowRight, Sparkles, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getParentDashboardData } from "@/lib/queries/parent"

type DashData = Awaited<ReturnType<typeof getParentDashboardData>>

export default function ParentDashboard() {
    const { data: session } = useSession()
    const [data, setData] = useState<DashData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!session?.user?.id) return
        getParentDashboardData(session.user.id).then((d) => {
            setData(d)
            setLoading(false)
        })
    }, [session?.user?.id])

    if (loading || !data) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
                </div>
            </div>
        )
    }

    const parentName = session?.user?.name?.split(" ")[0] ?? "there"
    const hasActivity = data.recentAlerts.length > 0
    const totalCompletedLessons = data.recentAlerts.length

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                            <GraduationCap className="h-3 w-3" /> Parent Dashboard
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {parentName}!</h1>
                        <p className="text-indigo-100">
                            {hasActivity
                                ? `Your children have completed ${totalCompletedLessons} lessons recently. Great progress!`
                                : "Your children are ready to start their learning journey!"}
                        </p>
                    </div>
                    <Link href="/student/dashboard">
                        <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-full px-6 h-12 shadow-lg transition-transform hover:scale-105">
                            <BookOpen className="mr-2 h-4 w-4" /> View Student Portal
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Active Children"
                    value={data.childrenCount.toString()}
                    icon={<Users className="h-5 w-5 text-indigo-600" />}
                    trend={`${data.childrenCount} registered`}
                />
                <SummaryCard
                    title="Avg. Syllabus Completion"
                    value={`${data.avgCompletion}%`}
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                    trend={data.avgCompletion > 0 ? "Across all children" : "Lessons available now"}
                    trendUp={data.avgCompletion > 50}
                />
                <SummaryCard
                    title="Time Spent Learning"
                    value="—"
                    icon={<Clock className="h-5 w-5 text-blue-600" />}
                    trend="Tracking coming soon"
                />
            </div>

            {/* Children Snapshots */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Child Progress</h2>
                    <Link href="/parent/children">
                        <Button variant="outline">View Detailed Reports</Button>
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {data.children.length > 0 ? (
                        data.children.map((child, idx) => (
                            <ChildSnapshotCard
                                key={child.id}
                                name={child.name}
                                grade={child.grade ?? "Not set"}
                                xp={child.xp.toLocaleString()}
                                completionPct={child.completionPct}
                                recentActivity={child.recentActivity}
                                color={idx % 2 === 0 ? "bg-indigo-500" : "bg-pink-500"}
                                isNew={child.xp === 0 && child.completionPct === 0}
                            />
                        ))
                    ) : (
                        <div className="col-span-2">
                            <Card className="border-2 border-dashed border-slate-200">
                                <CardContent className="p-8 text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                                        <Users className="h-8 w-8 text-indigo-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">No children registered yet</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">Add a child to begin their personalised learning journey with AI-powered tutoring.</p>
                                    <Link href="/parent/children">
                                        <Button>Add Child <ArrowRight className="ml-2 h-4 w-4" /></Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>

            {/* Getting Started Guide (for new users) */}
            {!hasActivity && data.children.length > 0 && (
                <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 md:p-8">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                            <Sparkles className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-bold text-slate-900">Getting Started Guide</h3>
                            <div className="space-y-2 text-sm text-slate-600">
                                <p className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                    <span><strong>Account created</strong> — You&apos;re all set up!</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                    <span><strong>Child profiles ready</strong> — {data.childrenCount} child(ren) registered</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />
                                    <span><strong>Start first lesson</strong> — Visit the Student Portal to begin</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />
                                    <span><strong>Track progress</strong> — Come back here to see detailed reports</span>
                                </p>
                            </div>
                            <Link href="/student/dashboard">
                                <Button className="mt-2" size="sm">
                                    Go to Student Portal <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Alerts / Notifications */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-900">Recent Activity</h3>
                <div className="space-y-4">
                    {data.recentAlerts.length > 0 ? (
                        data.recentAlerts.map((alert, i) => (
                            <AlertItem
                                key={i}
                                icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                                title="Lesson Completed"
                                message={`${alert.childName} completed '${alert.lessonTitle}' with ${alert.score}% accuracy.`}
                                time={timeAgo(alert.completedAt)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <Activity className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No activity yet. Start a lesson in the Student Portal to see progress here.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

function timeAgo(date: Date) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

function SummaryCard({ title, value, icon, trend, trendUp }: {
    title: string; value: string; icon: React.ReactNode; trend: string; trendUp?: boolean
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-slate-900">{value}</div>
                <p className={`text-xs mt-1 ${trendUp ? "text-green-600 font-medium" : "text-slate-400"}`}>
                    {trend}
                </p>
            </CardContent>
        </Card>
    )
}

function ChildSnapshotCard({ name, grade, xp, completionPct, recentActivity, color, isNew }: {
    name: string; grade: string; xp: string; completionPct: number; recentActivity: string; color: string; isNew: boolean
}) {
    return (
        <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: isNew ? "#6366f1" : completionPct > 30 ? "#22c55e" : "#f59e0b" }}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center text-white font-bold text-lg`}>
                            {name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">{name}</h3>
                            <p className="text-sm text-slate-500">{grade}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isNew ? "bg-indigo-100 text-indigo-700" : completionPct > 30 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                        {isNew ? "New" : completionPct > 30 ? "On Track" : "Getting Started"}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-3 rounded-lg">
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Total XP</p>
                        <p className="font-bold text-slate-900">{xp}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Completion</p>
                        <p className="font-bold text-slate-900">{completionPct}%</p>
                    </div>
                </div>

                <div className="text-sm text-slate-600 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                    {recentActivity}
                </div>

                {isNew && (
                    <Link href="/student/dashboard">
                        <Button size="sm" variant="outline" className="w-full mt-3 rounded-lg">
                            Start Learning <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    )
}

function AlertItem({ icon, title, message, time }: {
    icon: React.ReactNode; title: string; message: string; time: string
}) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                <p className="text-sm text-slate-600">{message}</p>
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">{time}</span>
        </div>
    )
}
