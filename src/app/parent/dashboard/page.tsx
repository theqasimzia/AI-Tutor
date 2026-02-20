"use client"

import { Activity, Clock, TrendingUp, Users, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ParentDashboard() {
    return (
        <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Active Children"
                    value="2"
                    icon={<Users className="h-5 w-5 text-indigo-600" />}
                    trend="+1 this month"
                />
                <SummaryCard
                    title="Avg. Syllabus Completion"
                    value="72%"
                    icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                    trend="+5% vs last week"
                    trendUp
                />
                <SummaryCard
                    title="Time Spent Learning"
                    value="12.5 hrs"
                    icon={<Clock className="h-5 w-5 text-blue-600" />}
                    trend="Total this week"
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
                    <ChildSnapshotCard
                        name="John Doe"
                        grade="Year 5"
                        xp="1,250"
                        streak="5 Day Streak"
                        recentActivity="Completed 'Introduction to Fractions'"
                        status="On Track"
                        color="bg-indigo-500"
                    />
                    <ChildSnapshotCard
                        name="Sarah Doe"
                        grade="Year 3"
                        xp="850"
                        streak="2 Day Streak"
                        recentActivity="Started 'Nouns & Verbs'"
                        status="Needs Attention"
                        color="bg-pink-500"
                        alert
                    />
                </div>
            </section>

            {/* Recent Alerts / Notifications */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-900">Recent Alerts</h3>
                <div className="space-y-4">
                    <AlertItem
                        icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                        title="Lesson Completed"
                        message="John completed 'Introduction to Fractions' with 85% accuracy."
                        time="2 hours ago"
                    />
                    <AlertItem
                        icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
                        title="Daily Goal Missed"
                        message="Sarah hasn't logged in today. Encourage her to keep her streak!"
                        time="5 hours ago"
                    />
                </div>
            </section>
        </div>
    )
}

function SummaryCard({ title, value, icon, trend, trendUp }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-slate-900">{value}</div>
                <p className={`text-xs mt-1 ${trendUp ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                    {trend}
                </p>
            </CardContent>
        </Card>
    )
}

function ChildSnapshotCard({ name, grade, xp, streak, recentActivity, status, color, alert }: any) {
    return (
        <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: alert ? '#ef4444' : '#22c55e' }}>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${alert ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 bg-slate-50 p-3 rounded-lg">
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Total XP</p>
                        <p className="font-bold text-slate-900">{xp}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Streak</p>
                        <p className="font-bold text-slate-900">{streak}</p>
                    </div>
                </div>

                <div className="text-sm text-slate-600 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-400" />
                    {recentActivity}
                </div>
            </CardContent>
        </Card>
    )
}

function AlertItem({ icon, title, message, time }: any) {
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
