"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trophy, Star, Shield, Zap, Target, Award, Crown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useStudent } from "@/lib/student-context"
import { getStudentAchievements, getStudentDashboardData } from "@/lib/queries/student"

const badgeDefinitions: Record<string, { icon: React.ReactNode; title: string; description: string }> = {
    "quick-learner": { icon: <Zap className="h-8 w-8 text-yellow-500" />, title: "Quick Learner", description: "Complete 5 lessons in one day" },
    "streak-7": { icon: <Shield className="h-8 w-8 text-blue-500" />, title: "Protector", description: "Maintain a 7-day streak" },
    "sharpshooter": { icon: <Target className="h-8 w-8 text-red-500" />, title: "Sharpshooter", description: "Get 100% on a quiz" },
    "super-star": { icon: <Star className="h-8 w-8 text-purple-500" />, title: "Super Star", description: "Earn 1000 XP" },
    "scholar-king": { icon: <Crown className="h-8 w-8 text-slate-300" />, title: "Scholar King", description: "Reach Level 10" },
    "math-whiz": { icon: <Award className="h-8 w-8 text-slate-300" />, title: "Math Whiz", description: "Complete all Math modules" },
}

export default function AchievementsPage() {
    const { selectedStudent, loading: ctxLoading } = useStudent()
    const [achievements, setAchievements] = useState<any[]>([])
    const [dashData, setDashData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!selectedStudent?.id) return
        setLoading(true)
        Promise.all([
            getStudentAchievements(selectedStudent.id),
            getStudentDashboardData(selectedStudent.id),
        ]).then(([achv, dash]) => {
            setAchievements(achv)
            setDashData(dash)
            setLoading(false)
        })
    }, [selectedStudent?.id])

    const xp = selectedStudent?.xp ?? 0
    const level = Math.floor(xp / 500) + 1
    const nextLevelXp = level * 500
    const progressPct = nextLevelXp > 0 ? Math.round((xp / nextLevelXp) * 100) : 0
    const streak = dashData?.streak ?? 0
    const unlockedIds = new Set(achievements.map((a: any) => a.achievementId))
    const badgeCount = achievements.length

    if (ctxLoading || loading) {
        return <div className="space-y-10 animate-pulse"><div className="h-48 bg-slate-200 rounded-3xl" /></div>
    }

    const allBadges = Object.entries(badgeDefinitions).map(([id, def]) => ({
        ...def,
        achieved: unlockedIds.has(id),
    }))

    return (
        <div className="space-y-10">
            {/* Header / XP Summary */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-2xl shadow-amber-500/20">
                        <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-800">
                            <Trophy className="h-14 w-14 text-amber-400" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-1">Level {level} Scholar</h1>
                            <p className="text-slate-400">Keep going to reach the next level!</p>
                        </div>

                        <div className="max-w-md space-y-2">
                            <div className="flex justify-between text-sm font-bold text-slate-300">
                                <span>{xp.toLocaleString()} XP</span>
                                <span>Next Level: {nextLevelXp.toLocaleString()} XP</span>
                            </div>
                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progressPct, 100)}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-white">{streak}</div>
                            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Streak</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{badgeCount}</div>
                            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Badges</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">#{Math.max(1, 10 - level)}</div>
                            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Rank</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges Grid */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Badges & Medals</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {allBadges.map((badge, i) => (
                        <BadgeCard key={i} icon={badge.icon} title={badge.title} description={badge.description} achieved={badge.achieved} />
                    ))}
                </div>
            </section>

            {/* Leaderboard (Mock) */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Weekly Leaderboard</h2>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {[1, 2, 3, 4, 5].map((rank) => (
                        <div key={rank} className={`flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 ${rank === 1 ? 'bg-amber-50/50' : ''}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold ${rank === 1 ? 'bg-amber-100 text-amber-700' :
                                rank === 2 ? 'bg-slate-200 text-slate-700' :
                                    rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'
                                }`}>
                                {rank}
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-200" style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${rank + 5})`, backgroundSize: 'cover' }} />
                            <div className="flex-1 font-bold text-slate-800">Student {rank + 10}</div>
                            <div className="font-mono text-sm font-bold text-violet-600">{2000 - (rank * 150)} XP</div>
                        </div>
                    ))}
                    {/* User Rank */}
                    <div className="flex items-center gap-4 p-4 bg-violet-50 border-t border-violet-100">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-violet-700">{Math.max(1, 10 - level)}</div>
                        <div className="h-10 w-10 rounded-full bg-violet-200 border-2 border-white flex items-center justify-center text-violet-700 font-bold">
                            {(selectedStudent?.name ?? "S").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex-1 font-bold text-slate-900">You</div>
                        <div className="font-mono text-sm font-bold text-violet-700">{xp.toLocaleString()} XP</div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function BadgeCard({ icon, title, description, achieved }: any) {
    return (
        <Card className={`text-center h-full border-0 transition-all ${achieved ? 'bg-white shadow-sm hover:translate-y-1' : 'bg-slate-50 opacity-60 grayscale'}`}>
            <CardContent className="pt-6 pb-6 flex flex-col items-center gap-3">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center ${achieved ? 'bg-slate-50 shadow-inner' : 'bg-slate-200'}`}>
                    {icon}
                </div>
                <div>
                    <h3 className="font-bold text-sm text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500 leading-tight mt-1">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
