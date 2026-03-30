"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Folder, FileText } from "lucide-react"
import { getSubjectsWithModulesAndLessons } from "@/lib/queries/admin"

type CurriculumData = Awaited<ReturnType<typeof getSubjectsWithModulesAndLessons>>

const borderColorMap: Record<string, string> = {
    blue: "border-l-blue-500",
    pink: "border-l-pink-500",
    orange: "border-l-orange-500",
    green: "border-l-green-500",
    purple: "border-l-purple-500",
}

export default function CurriculumPage() {
    const [subjects, setSubjects] = useState<CurriculumData>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getSubjectsWithModulesAndLessons().then((d) => {
            setSubjects(d)
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-12 bg-slate-200 rounded-xl w-1/2" />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-xl" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Curriculum Management</h1>
                    <p className="text-slate-500">Manage subjects, modules, and lessons.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add New Module
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    subject.modules.map((mod) => (
                        <Card key={mod.id} className={`border-l-4 ${borderColorMap[subject.color ?? "blue"]}`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-bold">{subject.name} ({subject.keyStage})</CardTitle>
                                <Folder className="h-4 w-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4">{mod.description ?? mod.title}</CardDescription>
                                <div className="space-y-2">
                                    {mod.lessons.map((lesson) => (
                                        <LessonItem key={lesson.id} title={lesson.title} status="Published" />
                                    ))}
                                    {mod.lessons.length === 0 && (
                                        <p className="text-sm text-slate-400">No lessons yet.</p>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" className="w-full mt-4">Manage Lessons</Button>
                            </CardContent>
                        </Card>
                    ))
                ))}

                {subjects.length === 0 && (
                    <div className="col-span-3 text-center p-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        No curriculum data yet. Start by adding subjects and modules.
                    </div>
                )}
            </div>
        </div>
    )
}

function LessonItem({ title, status }: any) {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-sm">
            <div className="flex items-center gap-2">
                <FileText className="h-3 w-3 text-slate-400" />
                <span className="font-medium text-slate-700">{title}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                }`}>
                {status}
            </span>
        </div>
    )
}
