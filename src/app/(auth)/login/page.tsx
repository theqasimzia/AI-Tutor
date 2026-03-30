"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { GraduationCap } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loginSchema } from "@/lib/validations"

const roleRedirectMap: Record<string, string> = {
    ADMIN: "/admin/dashboard",
    PARENT: "/parent/dashboard",
    STUDENT: "/student/dashboard",
}

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (intent: "student" | "parent" | "admin") => {
        setFieldErrors({})
        setError("")

        const parsed = loginSchema.safeParse({ email, password })
        if (!parsed.success) {
            const errors: Record<string, string> = {}
            for (const err of parsed.error.issues) {
                const key = String(err.path[0])
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

                const session = await getSession()
                const role = session?.user?.role ?? "PARENT"

                if (callbackUrl) {
                    router.push(callbackUrl)
                } else if (intent === "student") {
                    router.push("/student/dashboard")
                } else {
                    router.push(roleRedirectMap[role] || "/parent/dashboard")
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
                <Tabs defaultValue="parent" className="w-full" onValueChange={() => { setError(""); setFieldErrors({}) }}>
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="student">Student</TabsTrigger>
                        <TabsTrigger value="parent">Parent</TabsTrigger>
                        <TabsTrigger value="admin">Admin</TabsTrigger>
                    </TabsList>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-email">Email</Label>
                            <Input
                                id="login-email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {fieldErrors.email && (
                                <p className="text-red-600 text-sm">{fieldErrors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input
                                id="login-password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {fieldErrors.password && (
                                <p className="text-red-600 text-sm">{fieldErrors.password}</p>
                            )}
                        </div>
                    </div>

                    <TabsContent value="student" className="mt-4">
                        <Button className="w-full" onClick={() => handleLogin("student")} disabled={loading}>
                            {loading ? "Logging in..." : "Login as Student"}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            Use your parent&apos;s email to access the student dashboard
                        </p>
                    </TabsContent>

                    <TabsContent value="parent" className="mt-4">
                        <Button className="w-full" variant="secondary" onClick={() => handleLogin("parent")} disabled={loading}>
                            {loading ? "Logging in..." : "Login as Parent"}
                        </Button>
                    </TabsContent>

                    <TabsContent value="admin" className="mt-4">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white" onClick={() => handleLogin("admin")} disabled={loading}>
                            {loading ? "Logging in..." : "Login as Admin"}
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter>
                <div className="w-full text-sm text-center text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                        Sign up
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}
