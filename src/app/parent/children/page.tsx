"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Trophy, Clock, Target, Plus } from "lucide-react"

export default function ChildrenPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Children & Progress</h1>
                    <p className="text-slate-500">Detailed performance analytics for each child.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Child
                </Button>
            </div>

            <Tabs defaultValue="john" className="w-full">
                <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-6">
                    <TabsTrigger value="john" className="rounded-lg px-6">John Doe</TabsTrigger>
                    <TabsTrigger value="sarah" className="rounded-lg px-6">Sarah Doe</TabsTrigger>
                </TabsList>

                <TabsContent value="john" className="space-y-8">
                    {/* Subject Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject Performance</CardTitle>
                            <CardDescription>Mastery level across core subjects.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <SubjectBar subject="Mathematics" progress={75} color="bg-blue-500" />
                            <SubjectBar subject="English Language" progress={60} color="bg-pink-500" />
                            <SubjectBar subject="Science" progress={40} color="bg-orange-500" />
                        </CardContent>
                    </Card>

                    {/* Recent Lessons Table (Mock) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Lessons</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <LessonRow title="Fractions: Basics" score="90%" date="Today" status="Completed" />
                                <LessonRow title="Creative Writing" score="In Progress" date="Yesterday" status="Pending" />
                                <LessonRow title="Solar System" score="-" date="2 days ago" status="Not Started" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sarah">
                    <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        Analytics for Sarah will appear here once she completes her first lesson.
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function SubjectBar({ subject, progress, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span>{subject}</span>
                <span>{progress}% Mastery</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${progress}%` }} />
            </div>
        </div>
    )
}

function LessonRow({ title, score, date, status }: any) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${status === 'Completed' ? 'bg-green-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                <span className="font-medium text-slate-900">{title}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
                <span className="font-mono font-bold">{score}</span>
                <span className="w-20 text-right">{date}</span>
            </div>
        </div>
    )
}
