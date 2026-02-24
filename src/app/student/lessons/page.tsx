"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Play, CheckCircle2, Lock, Clock, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { curriculum } from "@/lib/curriculum" // Assuming this exists from previous steps

export default function MyCurriculumPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Curriculum</h1>
                    <p className="text-slate-500">Your personalized learning path for KS2 & KS3.</p>
                </div>
            </div>

            {/* Subject Tabs (Mock) */}
            <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                <Button variant="ghost" className="rounded-full bg-violet-100 text-violet-700 font-bold hover:bg-violet-200">
                    All Subjects
                </Button>
                <Button variant="ghost" className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                    Mathematics
                </Button>
                <Button variant="ghost" className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                    English
                </Button>
                <Button variant="ghost" className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                    Science
                </Button>
            </div>

            <div className="grid gap-8">
                {/* Maths Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Mathematics (KS2)</h2>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {curriculum.maths.ks2.map((module) => (
                            <ModuleCard key={module.id} module={module} subjectColor="bg-blue-500" />
                        ))}
                    </div>
                </section>

                {/* English Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-8 w-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">English (KS2)</h2>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {curriculum.english.ks2.map((module) => (
                            <ModuleCard key={module.id} module={module} subjectColor="bg-pink-500" />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

function ModuleCard({ module, subjectColor }: any) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-slate-900">{module.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{module.description}</p>
                </div>
                <div className={`h-2 w-2 rounded-full ${subjectColor}`} />
            </div>

            <div className="space-y-3">
                {module.lessons.map((lesson: any, index: number) => (
                    <Link key={lesson.id} href={`/lesson/${lesson.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${index === 0 ? "bg-green-100 border-green-200 text-green-700" : "bg-slate-50 border-slate-200 text-slate-400"
                                }`}>
                                {index === 0 ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                            </div>
                            <span className={`text-sm font-medium flex-1 ${index === 0 ? "text-slate-900" : "text-slate-600"}`}>
                                {lesson.title}
                            </span>
                            {index === 0 ? (
                                <Play className="h-4 w-4 text-violet-600 fill-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <Lock className="h-3 w-3 text-slate-300" />
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{module.lessons.length} Lessons</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~45 min</span>
            </div>
        </div>
    )
}
