"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Lock, Bell, Sparkles } from "lucide-react"

export default function ProfilePage() {
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
                                    JS
                                </div>
                                <Button variant="outline">Change Avatar</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First name</Label>
                                    <Input id="firstName" defaultValue="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last name</Label>
                                    <Input id="lastName" defaultValue="Smith" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="john.smith@student.com" readOnly className="bg-slate-50" />
                            </div>
                            <Button className="mt-4">Save Changes</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Level</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50">
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900">Key Stage 2 (Year 5)</p>
                                    <p className="text-sm text-slate-500">Standard UK Curriculum</p>
                                </div>
                                <Button variant="secondary" size="sm">Change Level</Button>
                            </div>
                        </CardContent>
                    </Card>
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

function CheckCircleFilled() {
    return (
        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
        </div>
    )
}
