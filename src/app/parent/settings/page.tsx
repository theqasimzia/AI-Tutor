"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                <p className="text-slate-500">Manage your profile and preferences.</p>
            </div>

            <section className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="parentName">Full Name</Label>
                            <Input id="parentName" defaultValue="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" defaultValue="jane.doe@example.com" />
                        </div>
                    </div>
                    <Button>Save Changes</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Weekly Progress Reports</Label>
                                <p className="text-sm text-slate-500">Receive a summary of your child's activity every Sunday.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Real-time Alerts</Label>
                                <p className="text-sm text-slate-500">Get notified when a child completes a milestone.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Marketing Updates</Label>
                                <p className="text-sm text-slate-500">Receive news about new features and promotions.</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
                    <p className="text-sm text-slate-500">Permanently delete your account and all child data.</p>
                    <Button variant="destructive">Delete Account</Button>
                </div>
            </section>
        </div>
    )
}
