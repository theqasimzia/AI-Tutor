"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Play, Star, Clock, CalendarDays, ChevronRight, Zap, Target, BookOpen, Brain, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress" // Assuming we have this, or I'll implement a simple one

export default function StudentDashboard() {
    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white ring-1 ring-white/30">
                        <Zap className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                        <span>Daily Streak: 5 Days!</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">Good Afternoon, John!</h1>
                    <p className="text-indigo-100 text-lg max-w-md">
                        You're making great progress in Fractions. Keep it up to reach Level 5!
                    </p>
                </div>
                <div className="relative z-10">
                    <Button className="h-14 px-8 rounded-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold shadow-lg border-0 text-base transition-transform hover:scale-105 active:scale-95">
                        <Play className="mr-2 h-5 w-5 fill-current" /> Continue Lesson
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <StatsCard
                    title="Weekly XP"
                    value="450"
                    subtitle="Top 10%"
                    icon={<Star className="h-6 w-6 text-white" />}
                    gradient="from-amber-400 to-orange-500 shadow-amber-200"
                />
                <StatsCard
                    title="Lessons"
                    value="12"
                    subtitle="Completed"
                    icon={<BookOpen className="h-6 w-6 text-white" />}
                    gradient="from-blue-400 to-cyan-500 shadow-blue-200"
                />
                <StatsCard
                    title="Time"
                    value="3.5h"
                    subtitle="This Week"
                    icon={<Clock className="h-6 w-6 text-white" />}
                    gradient="from-emerald-400 to-teal-500 shadow-emerald-200"
                />
                <StatsCard
                    title="Accuracy"
                    value="92%"
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
                        <LessonCard
                            subject="Mathematics"
                            title="Mastering Equivalent Fractions"
                            description="Learn how to simplify and compare fractions."
                            progress={65}
                            duration="20 min"
                            color="bg-blue-500"
                            icon={<Calculator className="h-6 w-6 text-white" />}
                        />
                        <LessonCard
                            subject="English Grammar"
                            title="Creative Adjectives & Adverbs"
                            description="Enhance your writing with descriptive words."
                            progress={30}
                            duration="15 min"
                            color="bg-pink-500"
                            icon={<BookOpen className="h-6 w-6 text-white" />}
                        />
                        <LessonCard
                            subject="Science"
                            title="The Solar System: Mars"
                            description="Explore the red planet and its mysteries."
                            progress={0}
                            duration="25 min"
                            color="bg-orange-500"
                            icon={<Brain className="h-6 w-6 text-white" />}
                            isLocked={false}
                        />
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
                        <Button variant="outline" className="w-full rounded-xl border-2 font-bold text-slate-600 hover:text-slate-800 hover:border-slate-300">
                            Visit Arcade
                        </Button>
                    </div>

                    {/* Weekly Challenge Widget */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h3 className="font-bold text-lg mb-2 relative z-10">Weekly Challenge</h3>
                        <p className="text-slate-300 text-sm mb-4 relative z-10">Complete 3 Maths lessons to earn the "Number Cruncher" badge.</p>

                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-xs font-bold text-slate-400">
                                <span>Progress</span>
                                <span>2/3</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 w-2/3" />
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

function LessonCard({ subject, title, description, progress, duration, color, icon, isLocked }: any) {
    return (
        <Link href={`/lesson/${title.toLowerCase().replace(/\s+/g, '-')}`}>
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
