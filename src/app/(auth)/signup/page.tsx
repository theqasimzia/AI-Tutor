"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            router.push("/student/dashboard") // Auto-login to student for demo
        }, 1500)
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary p-2 rounded-xl">
                        <GraduationCap className="h-8 w-8 text-primary-foreground" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Start your learning journey today
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input id="first-name" required placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input id="last-name" required placeholder="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Parent Email</Label>
                        <Input id="email" type="email" placeholder="parent@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Sign Up"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <div className="w-full text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                        Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
