"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, CheckCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAdminDashboardStats } from "@/lib/queries/admin"

type StatsData = Awaited<ReturnType<typeof getAdminDashboardStats>>

export default function AdminDashboard() {
    const [data, setData] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getAdminDashboardStats().then((d) => {
            setData(d)
            setLoading(false)
        })
    }, [])

    if (loading || !data) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={data.totalUsers.toLocaleString()}
                    subtext={`${data.totalStudents} students`}
                    icon={<Users className="h-4 w-4 text-slate-500" />}
                />
                <StatCard
                    title="Active Learners"
                    value={data.totalStudents.toLocaleString()}
                    subtext="Registered students"
                    icon={<CheckCircle className="h-4 w-4 text-slate-500" />}
                />
                <StatCard
                    title="Completed Lessons"
                    value={data.totalCompletedLessons.toLocaleString()}
                    subtext="Total across platform"
                    icon={<BookOpen className="h-4 w-4 text-slate-500" />}
                />
                <StatCard
                    title="Revenue"
                    value="$0.00"
                    subtext="Stripe not integrated yet"
                    icon={<DollarSign className="h-4 w-4 text-slate-500" />}
                />
            </div>

            {/* Recent Signups Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Recent Signups</h3>
                </div>
                <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Email</th>
                                <th className="px-6 py-3 font-medium">Role</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.recentSignups.map((user) => (
                                <tr key={user.id} className="bg-white hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{user.name ?? "—"}</td>
                                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <span className="font-bold text-xs text-blue-600">Edit</span>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {data.recentSignups.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, subtext, icon }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <p className="text-xs text-slate-400 mt-1">{subtext}</p>
            </CardContent>
        </Card>
    )
}
