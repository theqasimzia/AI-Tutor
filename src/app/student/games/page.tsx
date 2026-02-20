"use client"

import { Gamepad2, Brain, History, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const games = [
    {
        id: "math-blaster",
        title: "Math Blaster",
        description: "Destroy asteroids by solving equations before they hit your ship!",
        category: "Maths",
        icon: Calculator,
        color: "bg-blue-500",
        xp: "+50 XP per round",
        href: "/student/games/math-blaster"
    },
    {
        id: "word-wizard",
        title: "Word Wizard",
        description: "Cast spells by connecting letters to form syllabus words.",
        category: "English",
        icon: Brain,
        color: "bg-purple-500",
        xp: "+30 XP per spell",
        href: "/student/games/word-wizard"
    },
    {
        id: "history-hero",
        title: "History Hero",
        description: "Travel through time and fix historical inaccuracies.",
        category: "History",
        icon: History,
        color: "bg-yellow-500",
        xp: "+100 XP per mission",
        href: "/student/games/history-hero"
    }
]

export default function GamesPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Game Center</h1>
                <p className="text-muted-foreground">Play games, earn XP, and master your subjects!</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => {
                    const Icon = game.icon
                    return (
                        <Card key={game.id} className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50">
                            <div className={`h-32 ${game.color} flex items-center justify-center`}>
                                <Icon className="h-16 w-16 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{game.category}</span>
                                    <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs px-2 py-1 rounded-full font-bold">{game.xp}</span>
                                </div>
                                <CardTitle className="mt-2">{game.title}</CardTitle>
                                <CardDescription>{game.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={game.href}>
                                    <Button className="w-full group-hover:bg-primary/90">Play Now</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
