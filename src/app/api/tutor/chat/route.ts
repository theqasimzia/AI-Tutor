import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { openai } from "@ai-sdk/openai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { AI_CONFIG } from "@/lib/ai/config"
import { buildSystemPrompt } from "@/lib/ai/system-prompt"
import { tutorTools } from "@/lib/ai/tools"
import { retrieveContent, getEmbeddingCount } from "@/lib/ai/rag"
import { SessionPhase } from "@prisma/client"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  const body = await req.json()
  const {
    messages: uiMessages,
    sessionId,
    studentId,
    lessonId,
  }: {
    messages: UIMessage[]
    sessionId?: string
    studentId: string
    lessonId?: string
  } = body

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      name: true,
      grade: true,
      interests: true,
      parentId: true,
    },
  })

  if (!student || student.parentId !== session.user.id) {
    return new Response("Unauthorized", { status: 403 })
  }

  let tutorSession = sessionId
    ? await prisma.tutorSession.findUnique({ where: { id: sessionId } })
    : null

  if (!tutorSession) {
    tutorSession = await prisma.tutorSession.create({
      data: {
        studentId: student.id,
        lessonId: lessonId ?? null,
        phase: SessionPhase.GREETING,
      },
    })
  }

  const lesson = lessonId
    ? await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { module: { include: { subject: true } } },
      })
    : null

  const topic = lesson?.title ?? tutorSession.topic ?? "General revision"
  const subject = lesson?.module?.subject?.name ?? "Mathematics"
  const keyStage = lesson?.module?.subject?.keyStage ?? "KS2"

  const mastery = await prisma.topicMastery.findMany({
    where: { studentId: student.id },
    orderBy: { lastPracticed: "desc" },
    take: 10,
  })

  let curriculumContext = ""
  const embeddingCount = await getEmbeddingCount()
  if (embeddingCount > 0) {
    try {
      const ragResults = await retrieveContent(topic, { subject, keyStage })
      if (ragResults.length > 0) {
        curriculumContext = ragResults
          .map((r) => `[Source: ${r.source}]\n${r.content}`)
          .join("\n\n---\n\n")
      }
    } catch {
      // RAG not available yet
    }
  }

  const systemPrompt = buildSystemPrompt({
    studentName: student.name,
    grade: student.grade ?? "Year 5",
    interests: student.interests,
    topic,
    subject,
    bloomLevel: tutorSession.bloomLevel,
    masteryData: mastery.map((m) => ({
      topic: m.topic,
      bloomLevel: m.bloomLevel,
      confidence: m.confidence,
    })),
    curriculumContext: curriculumContext || undefined,
  })

  const isComplexTeaching =
    uiMessages.length < 4 || tutorSession.phase === "TEACHING"
  const model = isComplexTeaching
    ? AI_CONFIG.models.primary
    : AI_CONFIG.models.fast

  const modelMessages = await convertToModelMessages(uiMessages)

  const result = streamText({
    model: openai(model),
    system: systemPrompt,
    messages: modelMessages,
    tools: tutorTools,
    onFinish: async ({ text, toolCalls }) => {
      if (text) {
        await prisma.tutorMessage.create({
          data: {
            sessionId: tutorSession!.id,
            role: "assistant",
            content: text,
          },
        })
      }

      if (toolCalls && toolCalls.length > 0) {
        for (const tc of toolCalls) {
          const toolInput = tc.input as Record<string, unknown>

          if (tc.toolName === "update_mastery") {
            const args = toolInput as {
              topic: string
              subject: string
              correct: boolean
              newBloomLevel: number
              confidence: number
            }
            await prisma.topicMastery.upsert({
              where: {
                studentId_topic: {
                  studentId: student.id,
                  topic: args.topic,
                },
              },
              update: {
                bloomLevel: args.newBloomLevel,
                confidence: args.confidence,
                attempts: { increment: 1 },
                correct: args.correct ? { increment: 1 } : undefined,
                lastPracticed: new Date(),
              },
              create: {
                studentId: student.id,
                topic: args.topic,
                subject: args.subject,
                bloomLevel: args.newBloomLevel,
                confidence: args.confidence,
                attempts: 1,
                correct: args.correct ? 1 : 0,
              },
            })
          }

          if (tc.toolName === "end_session") {
            const args = toolInput as { score: number; summary: string }
            await prisma.tutorSession.update({
              where: { id: tutorSession!.id },
              data: {
                phase: SessionPhase.WRAP_UP,
                score: args.score,
                xpAwarded: Math.round(args.score * 1.5),
                endedAt: new Date(),
              },
            })
            await prisma.student.update({
              where: { id: student.id },
              data: { xp: { increment: Math.round(args.score * 1.5) } },
            })
          }

          await prisma.tutorMessage.create({
            data: {
              sessionId: tutorSession!.id,
              role: "tool",
              content: JSON.stringify(tc),
              metadata: toolInput as Record<string, never>,
            },
          })
        }
      }
    },
  })

  return result.toUIMessageStreamResponse({
    headers: { "X-Session-Id": tutorSession.id },
  })
}
