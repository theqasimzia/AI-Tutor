"use server"

import prisma from "@/lib/prisma"

export async function getSubjectsForStudent(studentId: string) {
  const subjects = await prisma.subject.findMany({
    orderBy: { order: "asc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  })

  const progress = await prisma.lessonProgress.findMany({
    where: { studentId },
  })
  const progressMap = new Map(progress.map((p) => [p.lessonId, p]))

  return subjects.map((subject) => ({
    ...subject,
    modules: subject.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => {
        const lp = progressMap.get(lesson.id)
        return {
          ...lesson,
          progress: lp
            ? { status: lp.status, score: lp.score, completedAt: lp.completedAt }
            : { status: "NOT_STARTED", score: 0, completedAt: null },
        }
      }),
    })),
  }))
}

export async function getLessonById(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: { subject: true },
      },
    },
  })
}
