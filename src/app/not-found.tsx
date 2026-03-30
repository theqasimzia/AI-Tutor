import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, LayoutDashboard } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-lg">
                <div className="space-y-2">
                    <h1 className="text-[120px] md:text-[160px] font-extrabold leading-none bg-gradient-to-br from-violet-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent select-none">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Page Not Found</h2>
                    <p className="text-lg text-slate-500 max-w-md mx-auto">
                        The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link href="/">
                        <Button size="lg" className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-violet-200">
                            <Home className="h-4 w-4" /> Go Home
                        </Button>
                    </Link>
                    <Link href="/parent/dashboard">
                        <Button size="lg" variant="outline" className="gap-2">
                            <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
