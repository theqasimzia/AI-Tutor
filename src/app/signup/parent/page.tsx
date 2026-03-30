"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronRight, Lock, User, Mail, Users, ArrowLeft, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { registerParent } from "@/app/actions/auth-actions"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { signupSchema } from "@/lib/validations"
import { toast } from "sonner"

export default function ParentSignupPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [step, setStep] = useState(1)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        parentName: "",
        email: "",
        password: "",
        childCount: "1",
        children: [{ yearGroup: "" }],
        referral: ""
    })

    const totalSteps = 3
    const progress = (step / totalSteps) * 100

    const passwordChecks = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
    }

    const handleChildCountChange = (value: string) => {
        const count = parseInt(value)
        setFormData(prev => ({
            ...prev,
            childCount: value,
            children: Array(count).fill({ yearGroup: "" })
        }))
    }

    const handleChildYearChange = (index: number, value: string) => {
        const newChildren = [...formData.children]
        newChildren[index] = { ...newChildren[index], yearGroup: value }
        setFormData(prev => ({ ...prev, children: newChildren }))
    }

    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {}

        if (!formData.parentName.trim() || formData.parentName.trim().length < 2) {
            errors.parentName = "Name must be at least 2 characters"
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            errors.email = "Please enter a valid email address"
        }

        if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters"
        } else if (!/[A-Z]/.test(formData.password)) {
            errors.password = "Password must contain at least 1 uppercase letter"
        } else if (!/[a-z]/.test(formData.password)) {
            errors.password = "Password must contain at least 1 lowercase letter"
        } else if (!/[0-9]/.test(formData.password)) {
            errors.password = "Password must contain at least 1 number"
        }

        if (!formData.childCount) {
            errors.childCount = "Please select number of children"
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validateStep2 = (): boolean => {
        const errors: Record<string, string> = {}
        formData.children.forEach((child, index) => {
            if (!child.yearGroup) {
                errors[`child-${index}`] = "Please select a year group"
            }
        })
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validateStep3 = (): boolean => {
        const errors: Record<string, string> = {}
        if (formData.referral && formData.referral.trim() !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.referral)) {
                errors.referral = "Please enter a valid email address"
            }
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const nextStep = () => {
        if (step === 1 && !validateStep1()) return
        if (step === 2 && !validateStep2()) return
        setStep(prev => Math.min(prev + 1, totalSteps))
        setFieldErrors({})
    }

    const prevStep = () => {
        setFieldErrors({})
        setStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep3()) return

        const parsed = signupSchema.safeParse(formData)
        if (!parsed.success) {
            const errors: Record<string, string> = {}
            for (const err of parsed.error.issues) {
                const field = String(err.path[0])
                if (!errors[field]) errors[field] = err.message
            }
            setFieldErrors(errors)
            return
        }

        setIsLoading(true)
        setErrorMessage("")
        try {
            const result = await registerParent(formData)
            if (result.success) {
                toast.success("Account created! Signing you in...")
                const signInResult = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                })

                if (signInResult?.error) {
                    router.push("/login?registered=true")
                    return
                }

                router.push("/parent/dashboard")
                router.refresh()
            } else {
                setErrorMessage(result.message)
                toast.error(result.message)
            }
        } catch (error) {
            console.error(error)
            const msg = "An error occurred. Please try again."
            setErrorMessage(msg)
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-xl w-full border-0 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                    <motion.div
                        className="h-full bg-purple-600"
                        initial={{ width: "33%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <CardHeader className="text-center space-y-2 pb-6 pt-8">
                    <CardTitle className="text-3xl font-bold tracking-tight">Create your Family Account</CardTitle>
                    <CardDescription className="text-lg">Secure early access for your family</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Urgency Banner */}
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium animate-pulse">
                        <AlertCircle className="h-4 w-4" />
                        Hurry! Only <span className="font-bold">258</span> early access spots remaining
                    </div>

                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {/* Step Indicators */}
                    <div className="flex justify-between px-8 text-sm font-medium text-slate-500 mb-8 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-200 -z-10 translate-y-[-50%] mx-12"></div>

                        <div className={`flex flex-col items-center gap-2 bg-white px-2 z-10 ${step >= 1 ? "text-purple-600" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-purple-600 bg-purple-50" : "border-slate-200 bg-white"}`}>1</div>
                            Basic Info
                        </div>
                        <div className={`flex flex-col items-center gap-2 bg-white px-2 z-10 ${step >= 2 ? "text-purple-600" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-purple-600 bg-purple-50" : "border-slate-200 bg-white"}`}>2</div>
                            Children Details
                        </div>
                        <div className={`flex flex-col items-center gap-2 bg-white px-2 z-10 ${step >= 3 ? "text-purple-600" : ""}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-purple-600 bg-purple-50" : "border-slate-200 bg-white"}`}>3</div>
                            Referral & Finish
                        </div>
                    </div>

                    <div className="min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Parent Name *</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="name"
                                                placeholder="John Doe"
                                                className="pl-10 h-11"
                                                value={formData.parentName}
                                                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                            />
                                        </div>
                                        {fieldErrors.parentName && (
                                            <p className="text-red-600 text-sm">{fieldErrors.parentName}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                className="pl-10 h-11"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        {fieldErrors.email && (
                                            <p className="text-red-600 text-sm">{fieldErrors.email}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Create Password *</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-11"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                        {fieldErrors.password && (
                                            <p className="text-red-600 text-sm">{fieldErrors.password}</p>
                                        )}
                                        {formData.password.length > 0 && (
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
                                    <div className="space-y-2">
                                        <Label>How many children would you like to sign up? *</Label>
                                        <Select value={formData.childCount} onValueChange={handleChildCountChange}>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select number of children" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 Child</SelectItem>
                                                <SelectItem value="2">2 Children</SelectItem>
                                                <SelectItem value="3">3 Children</SelectItem>
                                                <SelectItem value="4">4+ Children</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldErrors.childCount && (
                                            <p className="text-red-600 text-sm">{fieldErrors.childCount}</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {formData.children.map((child, index) => (
                                        <div key={index} className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                                            <Label className="text-base font-semibold">Child {index + 1} Year Group</Label>
                                            <Select
                                                value={child.yearGroup}
                                                onValueChange={(val: string) => handleChildYearChange(index, val)}
                                            >
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select Year Group" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="year3">Year 3 (Age 7-8)</SelectItem>
                                                    <SelectItem value="year4">Year 4 (Age 8-9)</SelectItem>
                                                    <SelectItem value="year5">Year 5 (Age 9-10)</SelectItem>
                                                    <SelectItem value="year6">Year 6 (Age 10-11)</SelectItem>
                                                    <SelectItem value="year7">Year 7 (Age 11-12)</SelectItem>
                                                    <SelectItem value="year8">Year 8 (Age 12-13)</SelectItem>
                                                    <SelectItem value="year9">Year 9 (Age 13-14)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {fieldErrors[`child-${index}`] && (
                                                <p className="text-red-600 text-sm">{fieldErrors[`child-${index}`]}</p>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="referral">Referral Email (optional)</Label>
                                        <Input
                                            id="referral"
                                            placeholder="friend@example.com"
                                            className="h-11"
                                            value={formData.referral}
                                            onChange={(e) => setFormData({ ...formData, referral: e.target.value })}
                                        />
                                        {fieldErrors.referral && (
                                            <p className="text-red-600 text-sm">{fieldErrors.referral}</p>
                                        )}
                                        <p className="text-xs text-slate-500">Know someone already on AI Tutor Academy? Adding their email might get you both free credits!</p>
                                    </div>

                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 flex gap-3 items-start">
                                        <Check className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-purple-900 text-sm">Almost there!</h4>
                                            <p className="text-sm text-purple-700 mt-1">By clicking Submit, you agree to our Terms of Service and Privacy Policy. Your data is safe with us.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t p-6 bg-slate-50/50">
                    {step > 1 ? (
                        <Button variant="outline" onClick={prevStep} className="gap-2 h-11 px-6">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 3 ? (
                        <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700 h-11 px-8 gap-2 shadow-lg shadow-purple-200">
                            Continue <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 h-11 px-10 shadow-lg shadow-green-200 w-full md:w-auto disabled:opacity-50"
                        >
                            {isLoading ? "Creating Account..." : "Submit & Create Account"}
                        </Button>
                    )}
                </CardFooter>

                <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                        <Lock className="h-3 w-3" />
                        We respect your privacy. No spam, ever. Unsubscribe anytime.
                    </p>
                </div>
            </Card>
        </div>
    )
}
