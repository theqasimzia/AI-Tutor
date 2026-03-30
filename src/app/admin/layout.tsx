import type { Metadata } from "next"
import { AdminLayoutShell } from "./admin-layout-shell"

export const metadata: Metadata = {
    title: {
        template: "%s | Admin | AI Tutor Academy",
        default: "Admin Dashboard | AI Tutor Academy",
    },
    description: "Manage users, curriculum content, and platform settings for AI Tutor Academy.",
    robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayoutShell>{children}</AdminLayoutShell>
}
