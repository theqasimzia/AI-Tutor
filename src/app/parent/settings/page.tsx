"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { updateParentProfile } from "@/app/actions/parent-actions"
import { toast } from "sonner"

export default function SettingsPage() {
    const { data: session } = useSession()
    const [name, setName] = useState(session?.user?.name ?? "")
    const [email, setEmail] = useState(session?.user?.email ?? "")
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        if (!session?.user?.id) return
        setSaving(true)
        try {
            await updateParentProfile(session.user.id, { name: name || undefined, email: email || undefined })
            toast.success("Settings saved successfully")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save settings")
        } finally {
            setSaving(false)
        }
    }

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
                            <Input
                                id="parentName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
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
