"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Check, Zap, Shield } from "lucide-react"

export default function SubscriptionPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h1>
                <p className="text-xl text-slate-500">Choose the plan that fits your family's needs.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Current Plan */}
                <Card className="border-2 border-slate-200 relative">
                    <CardHeader>
                        <CardTitle className="text-2xl">Standard</CardTitle>
                        <CardDescription>Basic access for one child.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold text-slate-900">£9.99<span className="text-lg font-normal text-slate-500">/mo</span></div>
                        <ul className="space-y-3 pt-4">
                            <Feature text="1 Child Account" />
                            <Feature text="Access to Maths curriculum" />
                            <Feature text="Basic Progress Reports" />
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Downgrade</Button>
                    </CardFooter>
                </Card>

                {/* Premium Plan */}
                <Card className="border-2 border-indigo-600 relative bg-indigo-50/50 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                        Current Plan
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="h-6 w-6 text-indigo-600 fill-indigo-600" />
                            <CardTitle className="text-2xl text-indigo-900">AI Scholar</CardTitle>
                        </div>
                        <CardDescription>The ultimate AI tutoring experience.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-4xl font-bold text-slate-900">£19.99<span className="text-lg font-normal text-slate-500">/mo</span></div>
                        <ul className="space-y-3 pt-4">
                            <Feature text="Up to 3 Child Accounts" />
                            <Feature text="Full Maths & English Curriculum" />
                            <Feature text="Unlimited AI Voice Tutoring" />
                            <Feature text="Advanced Analytics & Insights" />
                            <Feature text="Priority Support" />
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Manage Subscription</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="bg-slate-100 rounded-xl p-8 text-center mt-12">
                <h3 className="font-bold text-lg mb-2">Need a School or Enterprise Plan?</h3>
                <p className="text-slate-500 mb-4">We offer custom packages for larger groups and educational institutions.</p>
                <Button variant="outline">Contact Sales</Button>
            </div>
        </div>
    )
}

function Feature({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-slate-700">
            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-green-600" />
            </div>
            {text}
        </li>
    )
}
