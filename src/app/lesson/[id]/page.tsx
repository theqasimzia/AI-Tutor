"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle2, XCircle, Play, ChevronRight, Award, Sparkles, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getLessonById } from "@/lib/queries/curriculum"
import { completeLesson, startLesson } from "@/app/actions/student-actions"
import { getLessonContent } from "@/lib/lesson-content"
import { getStudentsByParentId } from "@/lib/queries/student"

type Phase = "loading" | "intro" | "content" | "quiz" | "results"

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()

    const lessonId = params.id?.toString() ?? ""

    const [phase, setPhase] = useState<Phase>("loading")
    const [lessonData, setLessonData] = useState<Awaited<ReturnType<typeof getLessonById>>>(null)
    const [studentId, setStudentId] = useState<string | null>(null)

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [answers, setAnswers] = useState<number[]>([])
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)
    const [xpAwarded, setXpAwarded] = useState(0)

    const content = getLessonContent(lessonData?.title ?? "")
    const quiz = content.quiz

    useEffect(() => {
        if (!lessonId || !session?.user?.id) return

        Promise.all([
            getLessonById(lessonId),
            getStudentsByParentId(session.user.id),
        ]).then(([lesson, students]) => {
            setLessonData(lesson)
            if (students.length > 0) {
                setStudentId(students[0].id)
            }
            setPhase("intro")
        })
    }, [lessonId, session?.user?.id])

    const handleStartLesson = useCallback(async () => {
        if (studentId && lessonId) {
            try {
                await startLesson(studentId, lessonId)
            } catch {
                // Non-blocking — lesson can still proceed
            }
        }
        setPhase("content")
    }, [studentId, lessonId])

    const handleStartQuiz = () => {
        setPhase("quiz")
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setAnswers([])
        setShowExplanation(false)
    }

    const handleSelectAnswer = (idx: number) => {
        if (showExplanation) return
        setSelectedAnswer(idx)
    }

    const handleConfirmAnswer = () => {
        if (selectedAnswer === null) return
        setShowExplanation(true)
        setAnswers((prev) => [...prev, selectedAnswer])
    }

    const handleNextQuestion = async () => {
        setShowExplanation(false)
        setSelectedAnswer(null)

        if (currentQuestion + 1 < quiz.length) {
            setCurrentQuestion((prev) => prev + 1)
        } else {
            const allAnswers = [...answers]
            if (selectedAnswer !== null && allAnswers.length < quiz.length) {
                allAnswers.push(selectedAnswer)
            }
            const correct = allAnswers.filter((a, i) => a === quiz[i]?.correctIndex).length
            const pct = quiz.length > 0 ? Math.round((correct / quiz.length) * 100) : 100

            setScore(pct)

            if (studentId && lessonId) {
                try {
                    const result = await completeLesson(studentId, lessonId, pct)
                    setXpAwarded(result.xpAwarded)
                    toast.success(`Lesson completed! +${result.xpAwarded} XP`)
                } catch {
                    toast.error("Could not save progress")
                }
            }

            setPhase("results")
        }
    }

    const lessonTitle = lessonData?.title ?? "Lesson"
    const subjectName = lessonData?.module?.subject?.name ?? "Subject"
    const keyStage = lessonData?.module?.subject?.keyStage ?? ""
    const subjectColor = lessonData?.module?.subject?.color ?? "blue"
    const colorClass = subjectColor === "blue" ? "from-blue-500 to-blue-600" : subjectColor === "pink" ? "from-pink-500 to-pink-600" : "from-orange-500 to-orange-600"

    if (phase === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200 animate-pulse mx-auto" />
                    <p className="text-slate-500 font-medium">Loading lesson...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100/50 via-slate-50 to-slate-50 -z-10" />

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" onClick={() => router.push("/student/lessons")} aria-label="Back to lessons">
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="font-bold text-slate-800 text-lg leading-tight">{lessonTitle}</h1>
                        <p className="text-xs text-slate-500 font-medium">{subjectName} {keyStage && `• ${keyStage}`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {phase !== "intro" && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            <span className="font-bold capitalize">{phase === "content" ? "Learning" : phase === "quiz" ? `Question ${currentQuestion + 1}/${quiz.length}` : "Complete"}</span>
                        </div>
                    )}
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => router.push("/student/dashboard")}>
                        Exit
                    </Button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <AnimatePresence mode="wait">
                    {phase === "intro" && (
                        <IntroPhase
                            key="intro"
                            title={lessonTitle}
                            subject={subjectName}
                            keyStage={keyStage}
                            description={lessonData?.description ?? ""}
                            introduction={content.introduction}
                            questionCount={quiz.length}
                            colorClass={colorClass}
                            onStart={handleStartLesson}
                        />
                    )}
                    {phase === "content" && (
                        <ContentPhase
                            key="content"
                            content={content}
                            colorClass={colorClass}
                            onStartQuiz={handleStartQuiz}
                        />
                    )}
                    {phase === "quiz" && (
                        <QuizPhase
                            key={`quiz-${currentQuestion}`}
                            question={quiz[currentQuestion]}
                            questionIndex={currentQuestion}
                            totalQuestions={quiz.length}
                            selectedAnswer={selectedAnswer}
                            showExplanation={showExplanation}
                            onSelectAnswer={handleSelectAnswer}
                            onConfirm={handleConfirmAnswer}
                            onNext={handleNextQuestion}
                        />
                    )}
                    {phase === "results" && (
                        <ResultsPhase
                            key="results"
                            score={score}
                            xpAwarded={xpAwarded}
                            totalQuestions={quiz.length}
                            answers={answers}
                            quiz={quiz}
                            onRetry={() => {
                                setPhase("content")
                                setAnswers([])
                                setCurrentQuestion(0)
                                setScore(0)
                            }}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

function IntroPhase({ title, subject, keyStage, description, introduction, questionCount, colorClass, onStart }: {
    title: string; subject: string; keyStage: string; description: string; introduction: string; questionCount: number; colorClass: string; onStart: () => void
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className={`bg-gradient-to-br ${colorClass} rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        <BookOpen className="h-3 w-3" /> {subject} {keyStage && `• ${keyStage}`}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
                    {description && <p className="text-white/80 text-lg max-w-2xl">{description}</p>}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
                <h3 className="font-bold text-xl text-slate-800">What you&apos;ll learn</h3>
                <p className="text-slate-600 leading-relaxed">{introduction}</p>

                <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-600">
                        <BookOpen className="h-4 w-4 text-violet-500" /> Interactive lesson
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-green-500" /> {questionCount} quiz questions
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-600">
                        <Award className="h-4 w-4 text-amber-500" /> Earn XP
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={onStart} size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-violet-200 transition-transform hover:scale-105 active:scale-95">
                    <Play className="mr-2 h-5 w-5 fill-current" /> Start Lesson
                </Button>
            </div>
        </motion.div>
    )
}

function ContentPhase({ content, colorClass, onStartQuiz }: {
    content: ReturnType<typeof getLessonContent>; colorClass: string; onStartQuiz: () => void
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">Key Concepts</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{content.introduction}</p>

                <div className="space-y-3">
                    {content.keyPoints.map((point, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-violet-50 border border-violet-100"
                        >
                            <div className="h-7 w-7 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                                {i + 1}
                            </div>
                            <p className="text-slate-700 font-medium">{point}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {content.examples.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                    <h3 className="text-2xl font-bold text-slate-800">Worked Examples</h3>
                    <div className="space-y-4">
                        {content.examples.map((ex, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.15 }}
                                className={`p-5 rounded-xl bg-gradient-to-r ${colorClass} text-white`}
                            >
                                <h4 className="font-bold text-lg mb-2">{ex.title}</h4>
                                <p className="text-white/90">{ex.content}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-center pt-4">
                <Button onClick={onStartQuiz} size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg shadow-green-200 transition-transform hover:scale-105 active:scale-95">
                    I&apos;m Ready — Start Quiz <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </motion.div>
    )
}

function QuizPhase({ question, questionIndex, totalQuestions, selectedAnswer, showExplanation, onSelectAnswer, onConfirm, onNext }: {
    question: { question: string; options: string[]; correctIndex: number; explanation: string }
    questionIndex: number; totalQuestions: number; selectedAnswer: number | null
    showExplanation: boolean; onSelectAnswer: (i: number) => void; onConfirm: () => void; onNext: () => void
}) {
    const isCorrect = selectedAnswer === question.correctIndex
    const isLast = questionIndex + 1 >= totalQuestions

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Question {questionIndex + 1} of {totalQuestions}</span>
                    <span>{Math.round(((questionIndex) / totalQuestions) * 100)}% complete</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: `${((questionIndex) / totalQuestions) * 100}%` }}
                        animate={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
                        className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">{question.question}</h3>

                <div className="space-y-3">
                    {question.options.map((option, i) => {
                        let borderClass = "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                        let bgClass = ""

                        if (showExplanation) {
                            if (i === question.correctIndex) {
                                borderClass = "border-green-300"
                                bgClass = "bg-green-50"
                            } else if (i === selectedAnswer && i !== question.correctIndex) {
                                borderClass = "border-red-300"
                                bgClass = "bg-red-50"
                            } else {
                                borderClass = "border-slate-100 opacity-50"
                            }
                        } else if (selectedAnswer === i) {
                            borderClass = "border-violet-400 ring-2 ring-violet-200"
                            bgClass = "bg-violet-50"
                        }

                        return (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => onSelectAnswer(i)}
                                disabled={showExplanation}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${borderClass} ${bgClass} ${showExplanation ? "cursor-default" : "cursor-pointer"}`}
                            >
                                <span className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                                    {showExplanation && i === question.correctIndex ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    ) : showExplanation && i === selectedAnswer ? (
                                        <XCircle className="h-6 w-6 text-red-500" />
                                    ) : (
                                        String.fromCharCode(65 + i)
                                    )}
                                </span>
                                <span className="font-medium text-slate-700 text-lg">{option}</span>
                            </motion.button>
                        )
                    })}
                </div>

                {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`p-4 rounded-xl ${isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
                    >
                        <p className={`font-bold mb-1 ${isCorrect ? "text-green-700" : "text-amber-700"}`}>
                            {isCorrect ? "Correct! Well done!" : "Not quite right."}
                        </p>
                        <p className="text-slate-600">{question.explanation}</p>
                    </motion.div>
                )}
            </div>

            <div className="flex justify-center">
                {!showExplanation ? (
                    <Button
                        onClick={onConfirm}
                        disabled={selectedAnswer === null}
                        size="lg"
                        className="h-14 px-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-violet-200 disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
                    >
                        Check Answer
                    </Button>
                ) : (
                    <Button
                        onClick={onNext}
                        size="lg"
                        className="h-14 px-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg shadow-green-200 transition-transform hover:scale-105 active:scale-95"
                    >
                        {isLast ? "See Results" : "Next Question"} <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                )}
            </div>
        </motion.div>
    )
}

function ResultsPhase({ score, xpAwarded, totalQuestions, answers, quiz, onRetry }: {
    score: number; xpAwarded: number; totalQuestions: number
    answers: number[]
    quiz: { question: string; options: string[]; correctIndex: number; explanation: string }[]
    onRetry: () => void
}) {
    const correct = answers.filter((a, i) => a === quiz[i]?.correctIndex).length
    const passed = score >= 50

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className={`rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-xl ${passed ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    >
                        {passed ? (
                            <Sparkles className="h-20 w-20 mx-auto text-yellow-300" />
                        ) : (
                            <RotateCcw className="h-20 w-20 mx-auto text-white/80" />
                        )}
                    </motion.div>
                    <h2 className="text-4xl font-extrabold">
                        {passed ? "Brilliant!" : "Keep Practising!"}
                    </h2>
                    <p className="text-white/80 text-lg">
                        You scored {correct} out of {totalQuestions} ({score}%)
                    </p>
                    {xpAwarded > 0 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-lg font-bold"
                        >
                            <Award className="h-5 w-5 text-yellow-300" /> +{xpAwarded} XP Earned!
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Answer Review */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Review Your Answers</h3>
                <div className="space-y-3">
                    {quiz.map((q, i) => {
                        const wasCorrect = answers[i] === q.correctIndex
                        return (
                            <div key={i} className={`p-4 rounded-xl border ${wasCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                                <div className="flex items-start gap-3">
                                    {wasCorrect ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                    )}
                                    <div>
                                        <p className="font-bold text-slate-800">{q.question}</p>
                                        {!wasCorrect && (
                                            <p className="text-sm text-slate-600 mt-1">
                                                Your answer: <span className="font-medium text-red-600">{q.options[answers[i]]}</span>
                                                {" • "}
                                                Correct: <span className="font-medium text-green-700">{q.options[q.correctIndex]}</span>
                                            </p>
                                        )}
                                        <p className="text-sm text-slate-500 mt-1">{q.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                {!passed && (
                    <Button onClick={onRetry} size="lg" variant="outline" className="h-14 px-8 rounded-full font-bold text-lg border-2">
                        <RotateCcw className="mr-2 h-5 w-5" /> Try Again
                    </Button>
                )}
                <Link href="/student/lessons">
                    <Button size="lg" className="h-14 px-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-violet-200 transition-transform hover:scale-105">
                        {passed ? "Next Lesson" : "Back to Curriculum"} <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    )
}
