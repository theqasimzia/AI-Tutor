"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play, Star, Clock, CalendarDays, ChevronRight, Zap, Target, BookOpen, Brain, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStudent } from "@/lib/student-context"
import { getStudentDashboardData } from "@/lib/queries/student"

type DashboardData = Awaited<ReturnType<typeof getStudentDashboardData>>

export default function StudentDashboard() {
    const { selectedStudent, loading: ctxLoading } = useStudent()
    const [data, setData] = useState<DashboardData>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!selectedStudent?.id) return
        setLoading(true)
        getStudentDashboardData(selectedStudent.id).then((d) => {
            setData(d)
            setLoading(false)
        })
    }, [selectedStudent?.id])

    const studentName = data?.student?.name?.split(" ")[0] ?? selectedStudent?.name?.split(" ")[0] ?? "Student"
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"

    if (ctxLoading || loading) {
        return (
            <div className="space-y-10 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-3xl" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl" />)}
                </div>
            </div>
        )
    }

    const streak = data?.streak ?? 0
    const weeklyXp = data?.weeklyXp ?? 0
    const totalCompleted = data?.totalCompleted ?? 0
    const avgAccuracy = data?.avgAccuracy ?? 0
    const recentLessons = data?.recentLessons ?? []

    const inProgressLesson = recentLessons.find(l => l.status === "IN_PROGRESS")

    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white ring-1 ring-white/30">
                        <Zap className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                        <span>Daily Streak: {streak} {streak === 1 ? "Day" : "Days"}!</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">{greeting}, {studentName}!</h1>
                    <p className="text-indigo-100 text-lg max-w-md">
                        {totalCompleted > 0
                            ? `You've completed ${totalCompleted} lessons. Keep it up!`
                            : "Start your learning journey today!"}
                    </p>
                </div>
                <div className="relative z-10">
                    {inProgressLesson ? (
                        <Link href={`/lesson/${inProgressLesson.id}`}>
                            <Button className="h-14 px-8 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold shadow-lg border-0 text-base transition-transform hover:scale-105 active:scale-95">
                                <Play className="mr-2 h-5 w-5 fill-current" /> Continue Lesson
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/student/lessons">
                            <Button className="h-14 px-8 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold shadow-lg border-0 text-base transition-transform hover:scale-105 active:scale-95">
                                <Play className="mr-2 h-5 w-5 fill-current" /> Start Learning
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatsCard
                    title="Weekly XP"
                    value={weeklyXp.toString()}
                    subtitle={weeklyXp > 0 ? "Keep it up!" : "Start earning"}
                    icon={<Star className="h-6 w-6 text-white" />}
                    gradient="from-amber-400 to-orange-500 shadow-amber-200"
                />
                <StatsCard
                    title="Lessons"
                    value={totalCompleted.toString()}
                    subtitle="Completed"
                    icon={<BookOpen className="h-6 w-6 text-white" />}
                    gradient="from-blue-400 to-cyan-500 shadow-blue-200"
                />
                <StatsCard
                    title="Streak"
                    value={`${streak}d`}
                    subtitle="Current"
                    icon={<Clock className="h-6 w-6 text-white" />}
                    gradient="from-emerald-400 to-teal-500 shadow-emerald-200"
                />
                <StatsCard
                    title="Accuracy"
                    value={avgAccuracy > 0 ? `${avgAccuracy}%` : "N/A"}
                    subtitle="Avg. Score"
                    icon={<Target className="h-6 w-6 text-white" />}
                    gradient="from-pink-400 to-rose-500 shadow-pink-200"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lessons Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-800">Your Curriculum</h2>
                        <Link href="/student/lessons" className="text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center">
                            View Schedule <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentLessons.length > 0 ? (
                            recentLessons.slice(0, 3).map((lesson) => {
                                const subjectColor = lesson.subject === "Mathematics" ? "bg-blue-500"
                                    : lesson.subject === "English" ? "bg-pink-500"
                                    : "bg-orange-500"
                                const icon = lesson.subject === "Mathematics"
                                    ? <Calculator className="h-6 w-6 text-white" />
                                    : lesson.subject === "English"
                                    ? <BookOpen className="h-6 w-6 text-white" />
                                    : <Brain className="h-6 w-6 text-white" />
                                const progress = lesson.status === "COMPLETED" ? 100 : lesson.status === "IN_PROGRESS" ? 50 : 0

                                return (
                                    <LessonCard
                                        key={lesson.id}
                                        subject={lesson.subject}
                                        title={lesson.title}
                                        description={lesson.status === "COMPLETED" ? `Score: ${lesson.score}%` : lesson.status === "IN_PROGRESS" ? "Continue where you left off" : "Start this lesson"}
                                        progress={progress}
                                        duration="15 min"
                                        color={subjectColor}
                                        icon={icon}
                                        lessonId={lesson.id}
                                    />
                                )
                            })
                        ) : (
                            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500">
                                No lessons started yet. Visit your curriculum to begin!
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Column (1/3 width) - Games & Challenges */}
                <div className="space-y-8">
                    {/* Games Widget */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-800">Brain Games</h3>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">New!</span>
                        </div>

                        <div className="space-y-4">
                            <GameRow
                                title="Math Blaster"
                                category="Arithmetic"
                                color="bg-indigo-100 text-indigo-600"
                            />
                            <GameRow
                                title="Word Wizard"
                                category="Spelling"
                                color="bg-purple-100 text-purple-600"
                            />
                            <GameRow
                                title="History Hero"
                                category="Trivia"
                                color="bg-amber-100 text-amber-600"
                            />
                        </div>
                        <Link href="/student/games">
                            <Button variant="outline" className="w-full rounded-xl border-2 font-bold text-slate-600 hover:text-slate-800 hover:border-slate-300">
                                Visit Arcade
                            </Button>
                        </Link>
                    </div>

                    {/* Weekly Challenge Widget */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="font-bold text-lg mb-2 relative z-10">Weekly Challenge</h3>
                        <p className="text-slate-300 text-sm mb-4 relative z-10">Complete 3 Maths lessons to earn the "Number Cruncher" badge.</p>

                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                                <span>Progress</span>
                                <span>{Math.min(totalCompleted, 3)}/3</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${Math.min((totalCompleted / 3) * 100, 100)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, subtitle, icon, gradient }: { title: string, value: string, subtitle: string, icon: React.ReactNode, gradient: string }) {
    return (
        <Card className="border-0 shadow-lg bg-white overflow-hidden relative group hover:-translate-y-1 transition-transform duration-300">
            <div className={`absolute top-0 right-0 p-3 rounded-bl-3xl bg-gradient-to-br ${gradient} shadow-lg`}>
                {icon}
            </div>
            <CardContent className="p-6 pt-8">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{value}</h3>
                <p className="text-xs font-medium text-slate-400">{subtitle}</p>
            </CardContent>
        </Card>
    )
}

function LessonCard({ subject, title, description, progress, duration, color, icon, lessonId }: any) {
    return (
        <Link href={`/lesson/${lessonId}`}>
            <div className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all cursor-pointer flex items-center gap-5 relative overflow-hidden">
                {/* Progress Bar Background */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-100">
                    <div className={`h-full ${color}`} style={{ width: `${progress}%` }} />
                </div>

                {/* Icon Box */}
                <div className={`h-16 w-16 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${color} transition-transform group-hover:scale-110 duration-300`}>
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{subject}</span>
                        {progress > 0 && <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 rounded-full">{progress}%</span>}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-violet-700 transition-colors">{title}</h3>
                    <p className="text-sm text-slate-500 truncate">{description}</p>
                </div>

                {/* Action */}
                <div className="hidden sm:flex flex-col items-end gap-1 text-slate-400">
                    <div className="flex items-center gap-1 text-xs font-medium bg-slate-50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" /> {duration}
                    </div>
                    <Button size="icon" variant="ghost" className="rounded-full text-slate-300 group-hover:text-violet-600 group-hover:bg-violet-50 transition-all">
                        <Play className="w-5 h-5 fill-current" />
                    </Button>
                </div>
            </div>
        </Link>
    )
}

function GameRow({ title, category, color }: any) {
    return (
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color} font-bold text-sm`}>
                {title.charAt(0)}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
                <p className="text-xs text-slate-500">{category}</p>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-300 group-hover:text-slate-600">
                <Play className="h-4 w-4 fill-current" />
            </Button>
        </div>
    )
}
