import type { Metadata } from "next"
import { StudentProvider } from "@/lib/student-context"
import { StudentLayoutShell } from "./student-layout-shell"

export const metadata: Metadata = {
    title: {
        template: "%s | Student | AI Tutor Academy",
        default: "Student Dashboard | AI Tutor Academy",
    },
    description: "Access your personalised lessons, games, achievements and progress in AI Tutor Academy.",
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return (
        <StudentProvider>
            <StudentLayoutShell>{children}</StudentLayoutShell>
        </StudentProvider>
    )
}
