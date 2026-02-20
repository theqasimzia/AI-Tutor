"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Shield, Zap, Target, Award, Crown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

export default function AchievementsPage() {
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
                            <h1 className="text-3xl font-bold tracking-tight mb-1">Level 4 Scholar</h1>
                            <p className="text-slate-400">You are in the top 5% of students this week!</p>
                        </div>

                        <div className="max-w-md space-y-2">
                            <div className="flex justify-between text-sm font-bold text-slate-300">
                                <span>1,250 XP</span>
                                <span>Next Level: 2,000 XP</span>
                            </div>
                            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "62%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <div className="text-2xl font-bold text-white">5</div>
                            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Streak</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">12</div>
                            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Badges</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">#8</div>
                            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">Rank</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges Grid */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Badges & Medals</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <BadgeCard icon={<Zap className="h-8 w-8 text-yellow-500" />} title="Quick Learner" description="Complete 5 lessons in one day" achieved={true} />
                    <BadgeCard icon={<Shield className="h-8 w-8 text-blue-500" />} title="Protector" description="Maintain a 7-day streak" achieved={true} />
                    <BadgeCard icon={<Target className="h-8 w-8 text-red-500" />} title="Sharpshooter" description="Get 100% on a quiz" achieved={true} />
                    <BadgeCard icon={<Star className="h-8 w-8 text-purple-500" />} title="Super Star" description="Earn 1000 XP" achieved={true} />
                    <BadgeCard icon={<Crown className="h-8 w-8 text-slate-300" />} title="Scholar King" description="Reach Level 10" achieved={false} />
                    <BadgeCard icon={<Award className="h-8 w-8 text-slate-300" />} title="Math Whiz" description="Complete all Math modules" achieved={false} />
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
                        <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-violet-700">8</div>
                        <div className="h-10 w-10 rounded-full bg-violet-200 border-2 border-white flex items-center justify-center text-violet-700 font-bold">JS</div>
                        <div className="flex-1 font-bold text-slate-900">You</div>
                        <div className="font-mono text-sm font-bold text-violet-700">1,250 XP</div>
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
