"use client"

import { useParams, useRouter } from "next/navigation"
import { useChat, type UIMessage } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useSession } from "next-auth/react"
import { useState, useEffect, useRef, useMemo, FormEvent } from "react"
import {
  ArrowLeft,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Gamepad2,
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getLessonById } from "@/lib/queries/curriculum"
import { getStudentsByParentId } from "@/lib/queries/student"
import { createTutorSession } from "@/app/actions/tutor-actions"

type QuizData = {
  question: string
  options: string[]
  correctIndex: number
  hint: string
  bloomLevel: number
}

type GameData = {
  gameType: string
  title: string
  items: { question: string; answer: string; distractors?: string[] }[]
  difficulty: string
}

type SessionEndData = {
  summary: string
  score: number
  recommendation: string
}

function getTextFromMessage(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const lessonId = params.id?.toString() ?? ""

  const [studentId, setStudentId] = useState<string | null>(null)
  const [tutorSessionId, setTutorSessionId] = useState<string | null>(null)
  const [lessonTitle, setLessonTitle] = useState("Lesson")
  const [subjectName, setSubjectName] = useState("Subject")
  const [keyStage, setKeyStage] = useState("")
  const [ready, setReady] = useState(false)

  const [inputValue, setInputValue] = useState("")
  const [activeQuiz, setActiveQuiz] = useState<QuizData | null>(null)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [activeGame, setActiveGame] = useState<GameData | null>(null)
  const [sessionEnd, setSessionEnd] = useState<SessionEndData | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const initSent = useRef(false)

  useEffect(() => {
    if (!lessonId || !session?.user?.id) return

    Promise.all([
      getLessonById(lessonId),
      getStudentsByParentId(session.user.id),
    ]).then(async ([lesson, students]) => {
      if (lesson) {
        setLessonTitle(lesson.title)
        setSubjectName(lesson.module?.subject?.name ?? "Subject")
        setKeyStage(lesson.module?.subject?.keyStage ?? "")
      }
      if (students.length > 0) {
        const sid = students[0].id
        setStudentId(sid)
        const ts = await createTutorSession(sid, lessonId)
        setTutorSessionId(ts.id)
        setReady(true)
      }
    })
  }, [lessonId, session?.user?.id])

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/tutor/chat",
        body: { sessionId: tutorSessionId, studentId, lessonId },
      }),
    [tutorSessionId, studentId, lessonId]
  )

  const { messages, sendMessage, status } = useChat({
    transport,
    onToolCall({ toolCall }) {
      const toolInput = toolCall.input as Record<string, unknown>
      if (toolCall.toolName === "generate_quiz") {
        setActiveQuiz(toolInput as unknown as QuizData)
      }
      if (toolCall.toolName === "launch_game") {
        setActiveGame(toolInput as unknown as GameData)
      }
      if (toolCall.toolName === "end_session") {
        setSessionEnd(toolInput as unknown as SessionEndData)
      }
    },
  })

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    if (ready && !initSent.current && studentId) {
      initSent.current = true
      sendMessage({ text: "Hi! I'm ready to learn." })
    }
  }, [ready, studentId, sendMessage])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, activeQuiz, activeGame])

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading || activeQuiz || activeGame) return
    sendMessage({ text: inputValue })
    setInputValue("")
  }

  const handleQuizAnswer = (idx: number) => {
    if (showQuizResult || !activeQuiz) return
    setQuizAnswer(idx)
  }

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !activeQuiz) return
    setShowQuizResult(true)
    const correct = quizAnswer === activeQuiz.correctIndex

    setTimeout(() => {
      const answer = activeQuiz.options[quizAnswer]
      const correctAnswer = activeQuiz.options[activeQuiz.correctIndex]
      setActiveQuiz(null)
      setQuizAnswer(null)
      setShowQuizResult(false)
      sendMessage({
        text: correct
          ? `I answered "${answer}" and it was CORRECT.`
          : `I answered "${answer}" but the correct answer was "${correctAnswer}".`,
      })
    }, 2000)
  }

  const handleGameComplete = (score: number) => {
    const title = activeGame?.title
    const total = activeGame?.items.length
    setActiveGame(null)
    sendMessage({
      text: `I completed the game "${title}" and scored ${score} out of ${total}.`,
    })
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="space-y-4 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto h-16 w-16 rounded-full border-4 border-violet-200 border-t-violet-600"
          />
          <p className="font-medium text-slate-500">
            Preparing your lesson...
          </p>
        </div>
      </div>
    )
  }

  if (sessionEnd) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg space-y-6"
        >
          <div className="rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center text-white shadow-xl">
            <Award className="mx-auto mb-4 h-16 w-16 text-yellow-300" />
            <h2 className="text-3xl font-extrabold">Lesson Complete!</h2>
            <p className="mt-2 text-white/80">Score: {sessionEnd.score}%</p>
            <p className="text-white/80">
              +{Math.round(sessionEnd.score * 1.5)} XP
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-800">Summary</h3>
            <p className="text-slate-600">{sessionEnd.summary}</p>
            <h3 className="pt-2 font-bold text-slate-800">
              What to focus on next
            </h3>
            <p className="text-slate-600">{sessionEnd.recommendation}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/student/lessons")}
              className="h-12 flex-1 rounded-full bg-violet-600 font-bold text-white hover:bg-violet-700"
            >
              Back to Curriculum
            </Button>
            <Button
              onClick={() => router.push("/student/dashboard")}
              variant="outline"
              className="h-12 flex-1 rounded-full font-bold"
            >
              Dashboard
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.push("/student/lessons")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h1 className="text-sm font-bold leading-tight text-slate-800">
              {lessonTitle}
            </h1>
            <p className="text-xs text-slate-500">
              {subjectName} {keyStage && `\u2022 ${keyStage}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            <Sparkles className="h-3 w-3" /> AI Tutor
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => router.push("/student/dashboard")}
          >
            Exit
          </Button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="mx-auto w-full max-w-3xl flex-1 space-y-4 overflow-y-auto px-4 py-6"
      >
        {messages
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => {
            const text = getTextFromMessage(m)
            if (!text) return null
            return (
              <ChatBubble
                key={m.id}
                role={m.role as "user" | "assistant"}
                content={text}
              />
            )
          })}

        {activeQuiz && (
          <QuizCard
            quiz={activeQuiz}
            selectedAnswer={quizAnswer}
            showResult={showQuizResult}
            onSelect={handleQuizAnswer}
            onSubmit={handleQuizSubmit}
          />
        )}

        {activeGame && (
          <MiniGame game={activeGame} onComplete={handleGameComplete} />
        )}

        {isLoading && !activeQuiz && !activeGame && (
          <div className="flex items-center gap-2 pl-12 text-sm text-slate-400">
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex gap-1"
            >
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              <span className="h-2 w-2 rounded-full bg-violet-400" />
            </motion.div>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md">
        <form onSubmit={handleFormSubmit} className="mx-auto flex max-w-3xl gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your answer or ask a question..."
            className="h-12 flex-1 rounded-full border-slate-200 bg-slate-50 px-5 text-base"
            disabled={isLoading || !!activeQuiz || !!activeGame}
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full bg-violet-600 hover:bg-violet-700"
            disabled={
              isLoading || !inputValue.trim() || !!activeQuiz || !!activeGame
            }
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}

function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant"
  content: string
}) {
  const isAI = role === "assistant"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isAI
            ? "rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
            : "rounded-tr-sm bg-violet-600 text-white"
        }`}
      >
        {isAI && (
          <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-violet-600">
            <Sparkles className="h-3 w-3" /> AI Tutor
          </div>
        )}
        {content}
      </div>
    </motion.div>
  )
}

function QuizCard({
  quiz,
  selectedAnswer,
  showResult,
  onSelect,
  onSubmit,
}: {
  quiz: QuizData
  selectedAnswer: number | null
  showResult: boolean
  onSelect: (i: number) => void
  onSubmit: () => void
}) {
  const isCorrect = selectedAnswer === quiz.correctIndex

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg space-y-4 rounded-2xl border-2 border-violet-200 bg-white p-5 shadow-md"
    >
      <div className="flex items-center gap-2 text-sm font-bold text-violet-600">
        <CheckCircle2 className="h-4 w-4" /> Quiz Time!
      </div>
      <p className="text-lg font-bold text-slate-800">{quiz.question}</p>

      <div className="space-y-2">
        {quiz.options.map((opt, i) => {
          let cls =
            "border-slate-200 hover:border-violet-300 hover:bg-violet-50 cursor-pointer"
          if (showResult) {
            if (i === quiz.correctIndex) cls = "border-green-300 bg-green-50"
            else if (i === selectedAnswer)
              cls = "border-red-300 bg-red-50"
            else cls = "border-slate-100 opacity-50"
          } else if (selectedAnswer === i) {
            cls = "border-violet-400 bg-violet-50 ring-2 ring-violet-200"
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={showResult}
              className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${cls}`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                {showResult && i === quiz.correctIndex ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : showResult && i === selectedAnswer ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  String.fromCharCode(65 + i)
                )}
              </span>
              <span className="font-medium text-slate-700">{opt}</span>
            </button>
          )
        })}
      </div>

      {showResult && (
        <div
          className={`rounded-xl p-3 text-sm ${isCorrect ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
        >
          {isCorrect ? "Brilliant! Well done!" : `Not quite. ${quiz.hint}`}
        </div>
      )}

      {!showResult && (
        <Button
          onClick={onSubmit}
          disabled={selectedAnswer === null}
          className="h-11 w-full rounded-full bg-violet-600 font-bold hover:bg-violet-700"
        >
          Check Answer
        </Button>
      )}
    </motion.div>
  )
}

function MiniGame({
  game,
  onComplete,
}: {
  game: GameData
  onComplete: (score: number) => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)

  const item = game.items[currentIdx]
  if (!item) return null

  const options = [item.answer, ...(item.distractors || [])].sort(
    () => Math.random() - 0.5
  )

  const handleAnswer = (selected: string) => {
    if (answered) return
    setAnswered(true)
    const correct = selected === item.answer
    if (correct) setScore((s) => s + 1)

    setTimeout(() => {
      setAnswered(false)
      if (currentIdx + 1 < game.items.length) {
        setCurrentIdx((i) => i + 1)
      } else {
        onComplete(score + (correct ? 1 : 0))
      }
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg space-y-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-5 text-white shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Gamepad2 className="h-4 w-4" /> {game.title}
        </div>
        <span className="rounded-full bg-white/20 px-2 py-1 text-xs">
          {currentIdx + 1}/{game.items.length}
        </span>
      </div>

      <p className="py-4 text-center text-xl font-bold">{item.question}</p>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            disabled={answered}
            className={`rounded-xl p-3 text-sm font-bold transition-all ${
              answered && opt === item.answer
                ? "bg-green-400 text-white"
                : answered
                  ? "bg-white/10 opacity-50"
                  : "bg-white/20 hover:bg-white/30 active:scale-95"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-2 text-xs text-white/60">
        <span>
          Score: {score}/{game.items.length}
        </span>
        <span className="capitalize">{game.difficulty}</span>
      </div>
    </motion.div>
  )
}
