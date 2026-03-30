import type { Metadata } from "next"
import { ParentLayoutShell } from "./parent-layout-shell"

export const metadata: Metadata = {
    title: {
        template: "%s | Parent | AI Tutor Academy",
        default: "Parent Dashboard | AI Tutor Academy",
    },
    description: "Monitor your child's learning progress, manage subscriptions, and configure account settings.",
}

export default function ParentLayout({ children }: { children: React.ReactNode }) {
    return <ParentLayoutShell>{children}</ParentLayoutShell>
}
