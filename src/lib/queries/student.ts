"use server"

import prisma from "@/lib/prisma"
import { LessonStatus } from "@prisma/client"

export async function getStudentsByParentId(parentId: string) {
  return prisma.student.findMany({
    where: { parentId },
    select: { id: true, name: true, grade: true, xp: true, avatar: true, interests: true },
    orderBy: { createdAt: "asc" },
  })
}

export async function getStudentById(studentId: string) {
  return prisma.student.findUnique({
    where: { id: studentId },
    include: {
      progress: { include: { lesson: { include: { module: { include: { subject: true } } } } } },
      achievements: true,
      gameScores: { orderBy: { playedAt: "desc" } },
    },
  })
}

export async function getStudentDashboardData(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      progress: {
        include: { lesson: { include: { module: { include: { subject: true } } } } },
        orderBy: { updatedAt: "desc" },
      },
    },
  })
  if (!student) return null

  const completedLessons = student.progress.filter((p) => p.status === LessonStatus.COMPLETED)
  const recentLessons = student.progress.slice(0, 5)

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weeklyXp = completedLessons
    .filter((p) => p.completedAt && p.completedAt >= weekStart)
    .reduce((sum, p) => sum + p.score, 0)

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const completionDates = completedLessons
    .filter((p) => p.completedAt)
    .map((p) => {
      const d = new Date(p.completedAt!)
      d.setHours(0, 0, 0, 0)
      return d.getTime()
    })
  const uniqueDates = [...new Set(completionDates)].sort((a, b) => b - a)

  for (let i = 0; i < uniqueDates.length; i++) {
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)
    expectedDate.setHours(0, 0, 0, 0)
    if (uniqueDates[i] === expectedDate.getTime()) {
      streak++
    } else {
      break
    }
  }

  const completedWithScores = completedLessons.filter((p) => p.score > 0)
  const avgAccuracy =
    completedWithScores.length > 0
      ? Math.round(completedWithScores.reduce((s, p) => s + p.score, 0) / completedWithScores.length)
      : 0

  return {
    student: { id: student.id, name: student.name, grade: student.grade, xp: student.xp, avatar: student.avatar },
    weeklyXp,
    totalCompleted: completedLessons.length,
    streak,
    avgAccuracy,
    recentLessons: recentLessons.map((p) => ({
      id: p.lessonId,
      title: p.lesson?.title ?? "Unknown Lesson",
      subject: p.lesson?.module?.subject?.name ?? "Unknown",
      status: p.status,
      score: p.score,
      completedAt: p.completedAt,
    })),
  }
}

export async function getStudentAchievements(studentId: string) {
  return prisma.achievement.findMany({
    where: { studentId },
    orderBy: { unlockedAt: "desc" },
  })
}

export async function getSuggestedLessons(studentId: string) {
  const completedIds = (
    await prisma.lessonProgress.findMany({
      where: { studentId, status: LessonStatus.COMPLETED },
      select: { lessonId: true },
    })
  ).map((p) => p.lessonId)

  const inProgressIds = (
    await prisma.lessonProgress.findMany({
      where: { studentId, status: LessonStatus.IN_PROGRESS },
      select: { lessonId: true },
    })
  ).map((p) => p.lessonId)

  const inProgress = inProgressIds.length > 0
    ? await prisma.lesson.findMany({
        where: { id: { in: inProgressIds } },
        include: { module: { include: { subject: true } } },
        take: 2,
      })
    : []

  const notStarted = await prisma.lesson.findMany({
    where: {
      id: { notIn: [...completedIds, ...inProgressIds] },
    },
    include: { module: { include: { subject: true } } },
    orderBy: { order: "asc" },
    take: 3 - inProgress.length,
  })

  return [...inProgress, ...notStarted].map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    duration: l.duration,
    subject: l.module?.subject?.name ?? "General",
    subjectColor: l.module?.subject?.color ?? "blue",
    status: inProgressIds.includes(l.id)
      ? "IN_PROGRESS" as const
      : "NOT_STARTED" as const,
  }))
}

export async function getStudentGameScores(studentId: string) {
  const scores = await prisma.gameScore.findMany({
    where: { studentId },
    orderBy: { playedAt: "desc" },
  })
  const grouped: Record<string, typeof scores> = {}
  for (const s of scores) {
    if (!grouped[s.gameId]) grouped[s.gameId] = []
    grouped[s.gameId].push(s)
  }
  return grouped
}
