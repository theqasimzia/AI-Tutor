"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { History, Check, X, ShieldQuestion, ArrowRight } from "lucide-react"
import { useStudent } from "@/lib/student-context"
import { submitGameScore } from "@/app/actions/student-actions"

// Mock Questions
const timelineData = [
    {
        id: 1,
        era: "Victorian Era",
        year: 1837,
        question: "Which of these inventions became popular during the Victorian times?",
        options: [
            { id: "a", text: "The Steam Train", correct: true },
            { id: "b", text: "The iPhone", correct: false },
            { id: "c", text: "The Internet", correct: false },
        ]
    },
    {
        id: 2,
        era: "Ancient Egypt",
        year: -2500,
        question: "What were the Pyramids strictly built for?",
        options: [
            { id: "a", text: "Shopping Malls for Pharaohs", correct: false },
            { id: "b", text: "Tombs for Pharaohs", correct: true },
            { id: "c", text: "Grain Storage", correct: false },
        ]
    },
    {
        id: 3,
        era: "World War II",
        year: 1945,
        question: "Who was the Prime Minister of the UK during most of WWII?",
        options: [
            { id: "a", text: "Margaret Thatcher", correct: false },
            { id: "b", text: "Boris Johnson", correct: false },
            { id: "c", text: "Winston Churchill", correct: true },
        ]
    }
]

export default function HistoryHeroPage() {
    const [gameState, setGameState] = useState<"menu" | "playing" | "finished">("menu")
    const [currentLevel, setCurrentLevel] = useState(0)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
    const [score, setScore] = useState(0)

    const { selectedStudent } = useStudent()

    const handleOptionSelect = (isCorrectAnswer: boolean, optionId: string) => {
        if (selectedOption) return
        setSelectedOption(optionId)
        setIsCorrect(isCorrectAnswer)

        if (isCorrectAnswer) {
            setScore(s => s + 100)
            if (selectedStudent?.id) {
                submitGameScore(selectedStudent.id, "history-hero", 100, 100)
            }
        }

        setTimeout(() => {
            if (currentLevel < timelineData.length - 1) {
                setCurrentLevel(prev => prev + 1)
                setSelectedOption(null)
                setIsCorrect(null)
            } else {
                setGameState("finished")
            }
        }, 1500)
    }

    const restartGame = () => {
        setGameState("playing")
        setCurrentLevel(0)
        setScore(0)
        setSelectedOption(null)
        setIsCorrect(null)
    }

    const currentQ = timelineData[currentLevel]

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 h-full flex flex-col items-center">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                        <History className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl text-slate-800">History Hero</span>
                </div>
                <div className="bg-slate-100 text-slate-700 px-4 py-1 rounded-full font-bold text-sm">
                    Level {currentLevel + 1}/{timelineData.length}
                </div>
            </div>

            {gameState === "menu" ? (
                <div className="text-center space-y-8 mt-12 bg-amber-50 p-12 rounded-3xl border border-amber-100">
                    <div className="h-32 w-32 bg-yellow-400 rounded-full mx-auto flex items-center justify-center shadow-lg rotate-12">
                        <ShieldQuestion className="h-16 w-16 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Time Travel Awaits!</h1>
                        <p className="text-slate-600 max-w-md mx-auto">Travel to different eras and fix the historical timeline by answering correctly.</p>
                    </div>
                    <Button size="lg" className="rounded-full px-12 h-14 text-lg bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold" onClick={() => setGameState("playing")}>
                        Start Adventure
                    </Button>
                </div>
            ) : gameState === "finished" ? (
                <div className="text-center space-y-8 mt-12 animate-in fade-in zoom-in">
                    <div className="h-32 w-32 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                        <Check className="h-16 w-16 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Timeline Restored!</h1>
                        <p className="text-slate-600">You scored <span className="font-bold text-green-600">{score} XP</span>.</p>
                    </div>
                    <Button size="lg" className="rounded-full px-12 h-14 text-lg" onClick={restartGame}>
                        Play Again
                    </Button>
                </div>
            ) : (
                <div className="w-full max-w-xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQ.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-8"
                        >
                            {/* Question Card */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                                    {currentQ.era} • {currentQ.year > 0 ? currentQ.year : `${Math.abs(currentQ.year)} BC`}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 mt-4 leading-relaxed">{currentQ.question}</h2>
                            </div>

                            {/* Options */}
                            <div className="grid gap-4">
                                {currentQ.options.map((option) => {
                                    const isSelected = selectedOption === option.id
                                    const showResult = selectedOption !== null

                                    let variantClass = "bg-white hover:border-yellow-400 hover:bg-yellow-50"
                                    if (showResult) {
                                        if (option.correct) variantClass = "bg-green-100 border-green-500 text-green-800"
                                        else if (isSelected && !option.correct) variantClass = "bg-red-100 border-red-500 text-red-800"
                                        else variantClass = "opacity-50 grayscale"
                                    }

                                    return (
                                        <button
                                            key={option.id}
                                            disabled={showResult}
                                            onClick={() => handleOptionSelect(option.correct, option.id)}
                                            className={`w-full p-5 rounded-2xl border-2 text-left font-medium transition-all duration-200 flex items-center justify-between group ${variantClass}`}
                                        >
                                            <span className="text-lg">{option.text}</span>
                                            {showResult && option.correct && <Check className="h-6 w-6 text-green-600" />}
                                            {showResult && isSelected && !option.correct && <X className="h-6 w-6 text-red-600" />}
                                            {!showResult && <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}
