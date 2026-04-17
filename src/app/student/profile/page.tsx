"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, X, Plus } from "lucide-react"
import { useStudent } from "@/lib/student-context"
import { updateStudentProfile, updateStudentInterests } from "@/app/actions/student-actions"
import { toast } from "sonner"

export default function ProfilePage() {
    const { selectedStudent } = useStudent()
    const [saving, setSaving] = useState(false)
    const [name, setName] = useState("")

    const studentName = selectedStudent?.name ?? "Student"
    const nameParts = studentName.split(" ")
    const firstName = nameParts[0] ?? ""
    const lastName = nameParts.slice(1).join(" ") ?? ""
    const initials = studentName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    const grade = selectedStudent?.grade ?? "Not set"

    const handleSave = async () => {
        if (!selectedStudent?.id) return
        setSaving(true)
        try {
            const fullName = name.trim() || studentName
            await updateStudentProfile(selectedStudent.id, { name: fullName })
            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update profile")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 p-1 rounded-full">
                    <TabsTrigger value="general" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">General</TabsTrigger>
                    <TabsTrigger value="subscription" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Subscription</TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="h-24 w-24 rounded-full bg-violet-100 flex items-center justify-center text-3xl font-bold text-violet-600 border-4 border-white shadow-lg">
                                    {initials}
                                </div>
                                <Button variant="outline">Change Avatar</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input
                                        id="firstName"
                                        defaultValue={firstName}
                                        onChange={(e) => setName(`${e.target.value} ${lastName}`)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input
                                        id="lastName"
                                        defaultValue={lastName}
                                        onChange={(e) => setName(`${firstName} ${e.target.value}`)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue={`${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.com`} readOnly className="bg-slate-50" />
                            </div>
                            <Button className="mt-4" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900">Key Stage 2 ({grade})</p>
                                    <p className="text-sm text-slate-500">Standard UK Curriculum</p>
                                </div>
                                <Button variant="secondary" size="sm">Change Level</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <InterestsPicker
                        studentId={selectedStudent?.id}
                        initialInterests={selectedStudent?.interests ?? []}
                    />
                </TabsContent>

                <TabsContent value="subscription" className="space-y-6">
                    <Card className="border-violet-200 bg-violet-50/50">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-5 w-5 text-violet-600" />
                                <span className="text-sm font-bold text-violet-600 uppercase tracking-wider">Current Plan</span>
                            </div>
                            <CardTitle className="text-2xl">AI Scholar Premium</CardTitle>
                            <CardDescription>Active until Dec 31, 2024</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircleFilled /> Unlimited AI Voice Tutoring
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircleFilled /> Parent Analytics Dashboard
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircleFilled /> All Games Unlocked
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button variant="outline" className="bg-white">Manage Subscription</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const SUGGESTED_INTERESTS = [
    "dinosaurs", "space", "football", "minecraft", "animals",
    "robots", "cooking", "drawing", "music", "superheroes",
    "cars", "ocean", "harry potter", "lego", "science experiments",
    "dancing", "pokemon", "nature", "coding", "swimming",
]

function InterestsPicker({ studentId, initialInterests }: { studentId?: string; initialInterests: string[] }) {
    const [interests, setInterests] = useState<string[]>(initialInterests)
    const [customInput, setCustomInput] = useState("")
    const [saving, setSaving] = useState(false)

    const toggleInterest = (interest: string) => {
        setInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : prev.length < 10 ? [...prev, interest] : prev
        )
    }

    const addCustom = () => {
        const trimmed = customInput.trim().toLowerCase()
        if (!trimmed || interests.includes(trimmed) || interests.length >= 10) return
        setInterests((prev) => [...prev, trimmed])
        setCustomInput("")
    }

    const handleSave = async () => {
        if (!studentId) return
        setSaving(true)
        try {
            await updateStudentInterests(studentId, interests)
            toast.success("Interests updated! The AI tutor will use these to personalise lessons.")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save")
        } finally {
            setSaving(false)
        }
    }

    const hasChanges = JSON.stringify(interests.sort()) !== JSON.stringify(initialInterests.sort())

    return (
        <Card className="border-violet-200 bg-gradient-to-br from-violet-50/50 to-white">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-600" />
                    <CardTitle>My Interests</CardTitle>
                </div>
                <CardDescription>
                    Tell us what you love! The AI tutor will weave your interests into lessons to make learning fun.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                            <span
                                key={interest}
                                className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700"
                            >
                                {interest}
                                <button onClick={() => toggleInterest(interest)} className="ml-1 hover:text-violet-900">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Popular picks</p>
                    <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_INTERESTS.filter((s) => !interests.includes(s)).map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => toggleInterest(suggestion)}
                                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                            >
                                + {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Input
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustom()}
                        placeholder="Add your own interest..."
                        className="flex-1"
                        maxLength={50}
                    />
                    <Button variant="outline" size="icon" onClick={addCustom} disabled={!customInput.trim()}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <p className="text-xs text-slate-400">{interests.length}/10 interests selected</p>

                {hasChanges && (
                    <Button onClick={handleSave} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                        {saving ? "Saving..." : "Save Interests"}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

function CheckCircleFilled() {
    return (
        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
        </div>
    )
}
