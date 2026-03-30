"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play, CheckCircle2, Lock, Clock, BookOpen, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStudent } from "@/lib/student-context"
import { getSubjectsForStudent } from "@/lib/queries/curriculum"

type SubjectData = Awaited<ReturnType<typeof getSubjectsForStudent>>

const subjectColorMap: Record<string, string> = {
    blue: "bg-blue-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
}

const subjectBgMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    pink: "bg-pink-100 text-pink-600",
    orange: "bg-orange-100 text-orange-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
}

export default function MyCurriculumPage() {
    const { selectedStudent, loading: ctxLoading } = useStudent()
    const [subjects, setSubjects] = useState<SubjectData>([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState("all")

    useEffect(() => {
        if (!selectedStudent?.id) return
        setLoading(true)
        getSubjectsForStudent(selectedStudent.id).then((d) => {
            setSubjects(d)
            setLoading(false)
        })
    }, [selectedStudent?.id])

    const filteredSubjects = activeFilter === "all"
        ? subjects
        : subjects.filter(s => s.slug.startsWith(activeFilter))

    if (ctxLoading || loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-12 bg-slate-200 rounded-xl w-1/2" />
                <div className="h-8 bg-slate-200 rounded-full w-64" />
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Curriculum</h1>
                    <p className="text-slate-500">Your personalized learning path for KS2 & KS3.</p>
                </div>
            </div>

            {/* Subject Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                <Button
                    variant="ghost"
                    onClick={() => setActiveFilter("all")}
                    className={`rounded-full ${activeFilter === "all" ? "bg-violet-100 text-violet-700 font-bold hover:bg-violet-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                >
                    All Subjects
                </Button>
                {subjects.map(s => (
                    <Button
                        key={s.slug}
                        variant="ghost"
                        onClick={() => setActiveFilter(s.slug)}
                        className={`rounded-full ${activeFilter === s.slug ? "bg-violet-100 text-violet-700 font-bold hover:bg-violet-200" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
                    >
                        {s.name}
                    </Button>
                ))}
            </div>

            <div className="grid gap-8">
                {filteredSubjects.map((subject) => (
                    <section key={subject.id}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${subjectBgMap[subject.color ?? "blue"]}`}>
                                <BookOpen className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{subject.name} ({subject.keyStage})</h2>
                        </div>

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {subject.modules.map((module) => (
                                <ModuleCard key={module.id} module={module} subjectColor={subjectColorMap[subject.color ?? "blue"]} />
                            ))}
                        </div>
                    </section>
                ))}

                {filteredSubjects.length === 0 && (
                    <div className="text-center p-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        No subjects available yet.
                    </div>
                )}
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
                {module.lessons.map((lesson: any) => {
                    const status = lesson.progress?.status ?? "NOT_STARTED"
                    const isCompleted = status === "COMPLETED"
                    const isInProgress = status === "IN_PROGRESS"

                    return (
                        <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isCompleted
                                    ? "bg-green-100 border-green-200 text-green-700"
                                    : isInProgress
                                    ? "bg-blue-100 border-blue-200 text-blue-700"
                                    : "bg-slate-50 border-slate-200 text-slate-400"
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isInProgress ? <Play className="h-4 w-4 fill-blue-600" /> : lesson.order}
                                </div>
                                <span className={`text-sm font-medium flex-1 ${isCompleted ? "text-slate-900" : "text-slate-600"}`}>
                                    {lesson.title}
                                </span>
                                {isCompleted ? (
                                    <span className="text-xs font-bold text-green-600">{lesson.progress.score}%</span>
                                ) : isInProgress ? (
                                    <Play className="h-4 w-4 text-violet-600 fill-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <Lock className="h-3 w-3 text-slate-300" />
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{module.lessons.length} Lessons</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{module.lessons.length * 15} min</span>
            </div>
        </div>
    )
}
