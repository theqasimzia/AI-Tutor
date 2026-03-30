"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Trophy, Clock, Target, Plus } from "lucide-react"
import { getStudentsByParentId } from "@/lib/queries/student"
import { getChildDetailedProgress } from "@/lib/queries/parent"
import { addChild } from "@/app/actions/parent-actions"
import { toast } from "sonner"

const subjectColorMap: Record<string, string> = {
    blue: "bg-blue-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
}

export default function ChildrenPage() {
    const { data: session } = useSession()
    const [children, setChildren] = useState<any[]>([])
    const [selectedChild, setSelectedChild] = useState<string | null>(null)
    const [childProgress, setChildProgress] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newChildName, setNewChildName] = useState("")
    const [newChildGrade, setNewChildGrade] = useState("Year 3")
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        if (!session?.user?.id) return
        getStudentsByParentId(session.user.id).then((kids) => {
            setChildren(kids)
            if (kids.length > 0) setSelectedChild(kids[0].id)
            setLoading(false)
        })
    }, [session?.user?.id])

    useEffect(() => {
        if (!selectedChild) return
        getChildDetailedProgress(selectedChild).then(setChildProgress)
    }, [selectedChild])

    const handleAddChild = async () => {
        if (!session?.user?.id || !newChildName.trim()) return
        setAdding(true)
        try {
            await addChild(session.user.id, { name: newChildName.trim(), grade: newChildGrade })
            const kids = await getStudentsByParentId(session.user.id)
            setChildren(kids)
            setShowAddForm(false)
            setNewChildName("")
            toast.success("Child added successfully")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to add child")
        } finally {
            setAdding(false)
        }
    }

    if (loading) {
        return <div className="space-y-8 animate-pulse"><div className="h-64 bg-slate-200 rounded-2xl" /></div>
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Children & Progress</h1>
                    <p className="text-slate-500">Detailed performance analytics for each child.</p>
                </div>
                <Button className="gap-2" onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4" /> Add Child
                </Button>
            </div>

            {showAddForm && (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Child Name</Label>
                                <Input value={newChildName} onChange={(e) => setNewChildName(e.target.value)} placeholder="Enter name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Year Group</Label>
                                <select
                                    value={newChildGrade}
                                    onChange={(e) => setNewChildGrade(e.target.value)}
                                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
                                >
                                    {["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAddChild} disabled={adding}>
                                {adding ? "Adding..." : "Add"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={adding}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {children.length === 0 ? (
                <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    No children added yet. Click "Add Child" to get started.
                </div>
            ) : (
                <Tabs value={selectedChild ?? undefined} onValueChange={setSelectedChild} className="w-full">
                    <TabsList className="bg-white border border-slate-200 p-1 rounded-xl mb-6">
                        {children.map((child) => (
                            <TabsTrigger key={child.id} value={child.id} className="rounded-lg px-6">{child.name}</TabsTrigger>
                        ))}
                    </TabsList>

                    {children.map((child) => (
                        <TabsContent key={child.id} value={child.id} className="space-y-8">
                            {childProgress && childProgress.student?.id === child.id ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Subject Performance</CardTitle>
                                            <CardDescription>Mastery level across core subjects.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {childProgress.subjectProgress.map((sp: any) => (
                                                <SubjectBar
                                                    key={sp.subject}
                                                    subject={sp.subject}
                                                    progress={sp.completionPct}
                                                    color={subjectColorMap[sp.color ?? "blue"]}
                                                />
                                            ))}
                                            {childProgress.subjectProgress.length === 0 && (
                                                <p className="text-sm text-slate-500">No progress data yet.</p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Lessons</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {childProgress.recentLessons.length > 0 ? (
                                                    childProgress.recentLessons.map((l: any, i: number) => (
                                                        <LessonRow
                                                            key={i}
                                                            title={l.title}
                                                            score={l.status === "COMPLETED" ? `${l.score}%` : l.status === "IN_PROGRESS" ? "In Progress" : "—"}
                                                            date={l.completedAt ? timeAgo(l.completedAt) : "—"}
                                                            status={l.status === "COMPLETED" ? "Completed" : l.status === "IN_PROGRESS" ? "Pending" : "Not Started"}
                                                        />
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-slate-500">No lessons attempted yet.</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    Loading progress data...
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    )
}

function timeAgo(date: Date | string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
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
