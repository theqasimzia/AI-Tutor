"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Brain, Star, Wand2, RefreshCw, RotateCcw } from "lucide-react"
import { useStudent } from "@/lib/student-context"
import { submitGameScore } from "@/app/actions/student-actions"

// Mock Word List
const words = [
    { word: "SUMMER", hint: "It's the warmest season of the year." },
    { word: "SCHOOL", hint: "A place where you learn." },
    { word: "PLANET", hint: "Earth is one of these." },
    { word: "TUTOR", hint: "Someone who helps you learn." },
    { word: "GARDEN", hint: "Where flowers and vegetables grow." },
    { word: "CASTLE", hint: "A large strong building, usually built in the past by a ruler." },
    { word: "DRAGON", hint: "A mythical monster like a giant reptile." },
    { word: "SPACE", hint: "The physical universe beyond the earth's atmosphere." },
]

export default function WordWizardPage() {
    const [gameState, setGameState] = useState<"menu" | "playing" | "success">("menu")
    const [currentWordObj, setCurrentWordObj] = useState(words[0])
    const [scrambledLetters, setScrambledLetters] = useState<string[]>([])
    const [selectedIndices, setSelectedIndices] = useState<number[]>([])
    const [score, setScore] = useState(0)

    // Shuffle helper
    const shuffle = (array: any[]) => {
        return [...array].sort(() => Math.random() - 0.5)
    }

    const startLevel = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)]
        setCurrentWordObj(randomWord)
        setScrambledLetters(shuffle(randomWord.word.split("")))
        setSelectedIndices([])
        setGameState("playing")
    }

    const { selectedStudent } = useStudent()

    const handleLetterClick = (index: number) => {
        if (selectedIndices.includes(index) || gameState !== "playing") return

        const newSelected = [...selectedIndices, index]
        setSelectedIndices(newSelected)

        if (newSelected.length === currentWordObj.word.length) {
            const formedWord = newSelected.map(i => scrambledLetters[i]).join("")
            if (formedWord === currentWordObj.word) {
                setGameState("success")
                setScore(s => s + 50)
                if (selectedStudent?.id) {
                    submitGameScore(selectedStudent.id, "word-wizard", 50, 50)
                }
            } else {
                setTimeout(() => {
                    setSelectedIndices([])
                }, 500)
            }
        }
    }

    const handleUndo = () => {
        setSelectedIndices(prev => prev.slice(0, -1))
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 h-full flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                        <Brain className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl text-slate-800">Word Wizard</span>
                </div>
                <div className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-700" /> {score} XP
                </div>
            </div>

            {gameState === "menu" ? (
                <div className="text-center space-y-8 mt-12">
                    <div className="h-40 w-40 bg-purple-100 rounded-full mx-auto flex items-center justify-center animate-bounce">
                        <Wand2 className="h-20 w-20 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Ready to Cast Spells?</h1>
                        <p className="text-slate-500">Unscramble the letters to reveal the magic word.</p>
                    </div>
                    <Button size="lg" className="rounded-full px-12 h-14 text-lg bg-purple-600 hover:bg-purple-700" onClick={startLevel}>
                        Start Game
                    </Button>
                </div>
            ) : gameState === "success" ? (
                <div className="text-center space-y-8 mt-12 animate-in zoom-in duration-500">
                    <div className="h-40 w-40 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                        <Star className="h-20 w-20 text-green-600 fill-green-600 animate-spin-slow" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Magical!</h1>
                        <p className="text-slate-500">You spelled <span className="font-bold text-purple-600">{currentWordObj.word}</span> correctly.</p>
                    </div>
                    <Button size="lg" className="rounded-full px-12 h-14 text-lg" onClick={startLevel}>
                        Next Word
                    </Button>
                </div>
            ) : (
                <div className="w-full max-w-md space-y-12">
                    {/* Hint */}
                    <Card className="bg-purple-50 border-purple-100 p-6 text-center shadow-inner">
                        <p className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">HINT</p>
                        <p className="text-lg text-purple-900 font-medium italic">"{currentWordObj.hint}"</p>
                    </Card>

                    {/* Word Slots */}
                    <div className="flex justify-center gap-2 h-16">
                        {Array.from({ length: currentWordObj.word.length }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-12 h-14 border-b-4 flex items-center justify-center text-3xl font-bold transition-all ${selectedIndices[i] !== undefined
                                    ? "border-purple-600 text-purple-700"
                                    : "border-slate-200 text-slate-300"
                                    }`}
                            >
                                {selectedIndices[i] !== undefined ? scrambledLetters[selectedIndices[i]] : ""}
                            </div>
                        ))}
                    </div>

                    {/* Letters Grid */}
                    <div className="grid grid-cols-4 gap-4 justify-items-center">
                        {scrambledLetters.map((letter, index) => {
                            const isSelected = selectedIndices.includes(index)
                            return (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleLetterClick(index)}
                                    disabled={isSelected}
                                    className={`w-16 h-16 rounded-2xl shadow-md text-2xl font-bold border-b-4 flex items-center justify-center transition-all ${isSelected
                                        ? "bg-slate-100 text-slate-300 border-slate-200 cursor-default"
                                        : "bg-white text-slate-700 border-slate-300 hover:border-purple-400 hover:text-purple-600"
                                        }`}
                                >
                                    {letter}
                                </motion.button>
                            )
                        })}
                    </div>

                    <div className="flex justify-center">
                        <Button variant="ghost" onClick={handleUndo} disabled={selectedIndices.length === 0} className="text-slate-400 hover:text-slate-600">
                            <RotateCcw className="mr-2 h-4 w-4" /> Undo Last Letter
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}

function Card({ className, children }: any) {
    return <div className={`rounded-xl border ${className}`}>{children}</div>
}
