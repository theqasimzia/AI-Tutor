"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Calculator, Zap, Play, RotateCcw, Trophy } from "lucide-react"

type Asteroid = {
    id: number
    x: number // percentage
    y: number // percentage
    speed: number
    equation: string
    answer: number
}

export default function MathBlasterPage() {
    const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu")
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(3)
    const [asteroids, setAsteroids] = useState<Asteroid[]>([])
    const [inputValue, setInputValue] = useState("")
    const [level, setLevel] = useState(1)

    // Game loop ref to store the interval/animation frame if needed
    // Using a simpler interval approach for this demo

    useEffect(() => {
        if (gameState !== "playing") return

        const spawnInterval = setInterval(() => {
            spawnAsteroid()
        }, 2000 - (level * 100)) // Spawn faster as level increases

        const gameLoop = setInterval(() => {
            setAsteroids(prev => {
                const textInput = document.getElementById("math-input") as HTMLInputElement
                if (textInput) textInput.focus()

                return prev.map(ast => ({
                    ...ast,
                    y: ast.y + ast.speed
                })).filter(ast => {
                    if (ast.y > 90) {
                        setLives(l => {
                            const newLives = l - 1
                            if (newLives <= 0) setGameState("gameover")
                            return Math.max(0, newLives)
                        })
                        return false
                    }
                    return true
                })
            })
        }, 50)

        return () => {
            clearInterval(spawnInterval)
            clearInterval(gameLoop)
        }
    }, [gameState, level])

    const spawnAsteroid = () => {
        const operations = level > 2 ? ["+", "-", "*"] : ["+", "-"]
        const op = operations[Math.floor(Math.random() * operations.length)]
        let a = Math.floor(Math.random() * 10) + 1
        let b = Math.floor(Math.random() * 10) + 1
        let eq = ""
        let ans = 0

        if (op === "+") { ans = a + b; eq = `${a} + ${b}` }
        else if (op === "-") {
            if (a < b) [a, b] = [b, a] // Ensure positive result for simplicity
            ans = a - b; eq = `${a} - ${b}`
        }
        else if (op === "*") {
            a = Math.floor(Math.random() * 5) + 1 // Smaller numbers for multiplication
            b = Math.floor(Math.random() * 5) + 1
            ans = a * b; eq = `${a} × ${b}`
        }

        const newAsteroid: Asteroid = {
            id: Date.now(),
            x: Math.random() * 80 + 10, // 10% to 90%
            y: -10,
            speed: 0.2 + (level * 0.05),
            equation: eq,
            answer: ans
        }

        setAsteroids(prev => [...prev, newAsteroid])
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInputValue(val)

        const num = parseInt(val)
        if (!isNaN(num)) {
            const hitAsteroid = asteroids.find(ast => ast.answer === num)
            if (hitAsteroid) {
                // Destroy asteroid
                setAsteroids(prev => prev.filter(a => a.id !== hitAsteroid.id))
                setScore(s => s + 10)
                setInputValue("")
                if (score > 0 && score % 100 === 0) setLevel(l => l + 1)
            }
        }
    }

    const startGame = () => {
        setGameState("playing")
        setScore(0)
        setLives(3)
        setAsteroids([])
        setLevel(1)
        setInputValue("")
    }

    // Save Score
    useEffect(() => {
        if (gameState === 'gameover') {
            const currentXP = parseInt(localStorage.getItem('student_xp') || '1250')
            localStorage.setItem('student_xp', (currentXP + score).toString())
        }
    }, [gameState])

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl">Math Blaster</h1>
                        <p className="text-xs text-slate-500">Level {level}</p>
                    </div>
                </div>
                <div className="flex gap-6 font-mono font-bold text-lg">
                    <div className="text-slate-600">Score: {score}</div>
                    <div className="text-red-500">Lives: {"♥".repeat(Math.max(0, lives))}</div>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 bg-slate-900 rounded-2xl relative overflow-hidden shadow-inner border-4 border-slate-800">
                {/* Stars Background */}
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

                {gameState === "menu" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-50 text-white">
                        <h2 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">MATH BLASTER</h2>
                        <p className="mb-8 text-slate-300">Type the answer to destroy incoming asteroids!</p>
                        <Button size="lg" onClick={startGame} className="text-lg px-10 h-14 rounded-full bg-blue-600 hover:bg-blue-700 animate-pulse">
                            <Play className="mr-2 h-5 w-5" /> Start Mission
                        </Button>
                    </div>
                )}

                {gameState === "gameover" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 text-white">
                        <Trophy className="h-20 w-20 text-yellow-400 mb-4" />
                        <h2 className="text-4xl font-bold mb-2">Game Over!</h2>
                        <p className="text-2xl mb-6">Final Score: <span className="text-blue-400 font-mono">{score}</span></p>
                        <p className="text-sm text-slate-400 mb-8">+ {score} XP earned!</p>
                        <Button size="lg" onClick={startGame} className="text-lg px-8 rounded-full">
                            <RotateCcw className="mr-2 h-5 w-5" /> Play Again
                        </Button>
                    </div>
                )}

                {/* Asteroids */}
                <AnimatePresence>
                    {asteroids.map(ast => (
                        <motion.div
                            key={ast.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, top: `${ast.y}%`, left: `${ast.x}%` }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0 }} // controlled by state update
                            className="absolute transform -translate-x-1/2 w-16 h-16 flex items-center justify-center"
                            style={{ top: `${ast.y}%`, left: `${ast.x}%` }}
                        >
                            <div className="relative w-full h-full animate-spin-slow">
                                {/* SVG Asteroid shape */}
                                <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-700 stroke-slate-500 stroke-2 drop-shadow-lg">
                                    <path d="M50 0 L80 20 L100 50 L80 80 L50 100 L20 80 L0 50 L20 20 Z" />
                                </svg>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-lg drop-shadow-md">
                                {ast.equation}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Ship / Input Area */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 z-20">
                    <div className="relative">
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2">
                            {/* Spaceship Icon */}
                            <div className="w-12 h-12 bg-blue-500 clip-path-triangle mx-auto rotate-0" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
                        </div>
                        <Input
                            id="math-input"
                            type="number"
                            value={inputValue}
                            onChange={handleInput}
                            className="bg-slate-800/90 border-slate-600 text-white text-center text-2xl font-mono h-14 rounded-xl shadow-lg ring-offset-0 focus-visible:ring-blue-500"
                            placeholder="Type Answer..."
                            autoFocus
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
