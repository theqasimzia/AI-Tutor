"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Folder, FileText, MoveVertical } from "lucide-react"

export default function CurriculumPage() {
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
                {/* Math Module */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-bold">Mathematics (KS2)</CardTitle>
                        <Folder className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">Core numeracy skills including fractions, decimals, and geometry.</CardDescription>
                        <div className="space-y-2">
                            <LessonItem title="Place Value" status="Published" />
                            <LessonItem title="Fractions & Decimals" status="Published" />
                            <LessonItem title="Geometry Basics" status="Draft" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">Manage Lessons</Button>
                    </CardContent>
                </Card>

                {/* English Module */}
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-bold">English (KS2)</CardTitle>
                        <Folder className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">Reading comprehension, grammar, and creative writing.</CardDescription>
                        <div className="space-y-2">
                            <LessonItem title="Nouns & Verbs" status="Published" />
                            <LessonItem title="Creative Writing" status="Draft" />
                            <LessonItem title="Reading Comprehension" status="Draft" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">Manage Lessons</Button>
                    </CardContent>
                </Card>

                {/* Science Module */}
                <Card className="border-l-4 border-l-indigo-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base font-bold">Science (KS2)</CardTitle>
                        <Folder className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="mb-4">Biology, physics, and chemistry basics.</CardDescription>
                        <div className="space-y-2">
                            <LessonItem title="The Solar System" status="Published" />
                            <LessonItem title="Plants & Photosynthesis" status="Draft" />
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">Manage Lessons</Button>
                    </CardContent>
                </Card>
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
