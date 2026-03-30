"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerParent } from "@/app/actions/auth-actions"
import { signupSchema } from "@/lib/validations"

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const passwordChecks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setFieldErrors({})
        setError("")

        const fullName = `${firstName} ${lastName}`.trim()

        if (!firstName.trim()) {
            setFieldErrors(prev => ({ ...prev, firstName: "First name is required" }))
            return
        }
        if (!lastName.trim()) {
            setFieldErrors(prev => ({ ...prev, lastName: "Last name is required" }))
            return
        }

        const parsed = signupSchema.safeParse({
            parentName: fullName,
            email,
            password,
            children: [{ yearGroup: "" }],
        })

        if (!parsed.success) {
            const errors: Record<string, string> = {}
            for (const err of parsed.error.issues) {
                const field = String(err.path[0])
                if (field === "parentName") errors.firstName = err.message
                else if (!errors[field]) errors[field] = err.message
            }
            setFieldErrors(errors)
            return
        }

        setLoading(true)

        try {
            const result = await registerParent({
                parentName: fullName,
                email,
                password,
                children: [{ yearGroup: "" }],
            })

            if (!result.success) {
                setError(result.message)
                setLoading(false)
                return
            }

            const signInResult = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (signInResult?.error) {
                router.push("/login?registered=true")
                return
            }

            router.push("/parent/dashboard")
            router.refresh()
        } catch {
            setError("An error occurred. Please try again.")
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
                <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                    Start your learning journey today
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input
                                id="first-name"
                                required
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            {fieldErrors.firstName && (
                                <p className="text-red-600 text-sm">{fieldErrors.firstName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input
                                id="last-name"
                                required
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {fieldErrors.lastName && (
                                <p className="text-red-600 text-sm">{fieldErrors.lastName}</p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Parent Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="parent@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {fieldErrors.email && (
                            <p className="text-red-600 text-sm">{fieldErrors.email}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {fieldErrors.password && (
                            <p className="text-red-600 text-sm">{fieldErrors.password}</p>
                        )}
                        {password.length > 0 && (
                            <div className="space-y-1 pt-1">
                                <p className={`text-sm ${passwordChecks.length ? "text-green-600" : "text-slate-500"}`}>
                                    {passwordChecks.length ? "\u2713" : "\u2022"} At least 8 characters
                                </p>
                                <p className={`text-sm ${passwordChecks.uppercase ? "text-green-600" : "text-slate-500"}`}>
                                    {passwordChecks.uppercase ? "\u2713" : "\u2022"} At least 1 uppercase letter
                                </p>
                                <p className={`text-sm ${passwordChecks.lowercase ? "text-green-600" : "text-slate-500"}`}>
                                    {passwordChecks.lowercase ? "\u2713" : "\u2022"} At least 1 lowercase letter
                                </p>
                                <p className={`text-sm ${passwordChecks.number ? "text-green-600" : "text-slate-500"}`}>
                                    {passwordChecks.number ? "\u2713" : "\u2022"} At least 1 number
                                </p>
                            </div>
                        )}
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
