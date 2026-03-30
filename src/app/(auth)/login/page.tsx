"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { GraduationCap } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginSchema } from "@/lib/validations"

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const [studentEmail, setStudentEmail] = useState("")
    const [studentPassword, setStudentPassword] = useState("")
    const [parentEmail, setParentEmail] = useState("")
    const [parentPassword, setParentPassword] = useState("")

    const handleLogin = async (role: "student" | "parent") => {
        setFieldErrors({})
        setError("")

        const email = role === "student" ? studentEmail : parentEmail
        const password = role === "student" ? studentPassword : parentPassword

        const parsed = loginSchema.safeParse({ email, password })
        if (!parsed.success) {
            const errors: Record<string, string> = {}
            for (const err of parsed.error.issues) {
                const key = `${role}-${String(err.path[0])}`
                if (!errors[key]) errors[key] = err.message
            }
            setFieldErrors(errors)
            return
        }

        setLoading(true)

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Invalid email or password. Please try again.")
                toast.error("Invalid email or password")
                setLoading(false)
                return
            }

            if (result?.ok) {
                toast.success("Welcome back!")
                if (role === "student") {
                    router.push("/student/dashboard")
                } else {
                    router.push("/parent/dashboard")
                }
                router.refresh()
            }
        } catch {
            setError("Something went wrong. Please try again.")
            toast.error("Something went wrong. Please try again.")
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                    <div className="bg-primary p-2 rounded-xl">
                        <GraduationCap className="h-8 w-8 text-primary-foreground" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                <CardDescription className="text-center">
                    Login to your AI Tutor Academy account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}
                <Tabs defaultValue="student" className="w-full" onValueChange={() => { setError(""); setFieldErrors({}) }}>
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="student">Student</TabsTrigger>
                        <TabsTrigger value="parent">Parent</TabsTrigger>
                    </TabsList>

                    <TabsContent value="student">
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin("student") }}>
                            <div className="space-y-2">
                                <Label htmlFor="s-email">Parent Email</Label>
                                <Input
                                    id="s-email"
                                    type="email"
                                    placeholder="parent@example.com"
                                    required
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                />
                                {fieldErrors["student-email"] && (
                                    <p className="text-red-600 text-sm">{fieldErrors["student-email"]}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="s-password">Password</Label>
                                <Input
                                    id="s-password"
                                    type="password"
                                    required
                                    value={studentPassword}
                                    onChange={(e) => setStudentPassword(e.target.value)}
                                />
                                {fieldErrors["student-password"] && (
                                    <p className="text-red-600 text-sm">{fieldErrors["student-password"]}</p>
                                )}
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Logging in..." : "Login as Student"}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Use your parent&apos;s email to access your student dashboard
                            </p>
                        </form>
                    </TabsContent>

                    <TabsContent value="parent">
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin("parent") }}>
                            <div className="space-y-2">
                                <Label htmlFor="p-email">Parent Email</Label>
                                <Input
                                    id="p-email"
                                    type="email"
                                    placeholder="parent@example.com"
                                    required
                                    value={parentEmail}
                                    onChange={(e) => setParentEmail(e.target.value)}
                                />
                                {fieldErrors["parent-email"] && (
                                    <p className="text-red-600 text-sm">{fieldErrors["parent-email"]}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="p-password">Password</Label>
                                <Input
                                    id="p-password"
                                    type="password"
                                    required
                                    value={parentPassword}
                                    onChange={(e) => setParentPassword(e.target.value)}
                                />
                                {fieldErrors["parent-password"] && (
                                    <p className="text-red-600 text-sm">{fieldErrors["parent-password"]}</p>
                                )}
                            </div>
                            <Button className="w-full" type="submit" variant="secondary" disabled={loading}>
                                {loading ? "Logging in..." : "Login as Parent"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                        Sign up
                    </Link>
                </div>
                <div className="text-xs text-center text-muted-foreground/50">
                    <Link href="/admin" className="hover:text-primary">
                        Admin Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
