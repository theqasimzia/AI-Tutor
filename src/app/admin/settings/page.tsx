"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
                <p className="text-slate-500">Global configurations for AI Tutor Academy.</p>
            </div>

            <div className="grid gap-8">
                <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        General Configuration
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Platform Name</Label>
                            <Input defaultValue="AI Tutor Academy" />
                        </div>
                        <div className="space-y-2">
                            <Label>Support Email</Label>
                            <Input defaultValue="support@tutorinacademy.com" />
                        </div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-xl border border-slate-200 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        Feature Toggles
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>New User Registration</Label>
                                <p className="text-sm text-slate-500">Allow new users to sign up.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Maintenance Mode</Label>
                                <p className="text-sm text-slate-500">Disable platform access for non-admins.</p>
                            </div>
                            <Switch />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Experimental AI Features</Label>
                                <p className="text-sm text-slate-500">Enable beta voice capabilities for all users.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4">
                    <Button variant="outline">Discard Changes</Button>
                    <Button>Save Configuration</Button>
                </div>
            </div>
        </div>
    )
}
