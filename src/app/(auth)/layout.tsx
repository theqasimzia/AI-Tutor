import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sign In | AI Tutor Academy",
    description:
        "Log in or sign up for AI Tutor Academy — personalised AI-powered Maths and English tutoring aligned with the UK National Curriculum.",
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            {children}
        </div>
    )
}
