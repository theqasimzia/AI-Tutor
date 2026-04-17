"use server"

import prisma from "@/lib/prisma"
import { LessonStatus } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getStudentsByParentId } from "@/lib/queries/student"
import {
  updateStudentProfileSchema,
  startLessonSchema,
  completeLessonSchema,
  submitGameScoreSchema,
} from "@/lib/validations"

async function requireParentOfStudent(studentId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { parentId: true },
  })
  if (!student || student.parentId !== session.user.id) {
    throw new Error("Unauthorized: you are not the parent of this student")
  }
  return session
}

export async function getStudentsForParent(parentId: string) {
  return getStudentsByParentId(parentId)
}

export async function updateStudentProfile(
  studentId: string,
  data: { name?: string; avatar?: string }
) {
  const parsed = updateStudentProfileSchema.safeParse({ studentId, ...data })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  await requireParentOfStudent(parsed.data.studentId)

  const { studentId: id, ...updateData } = parsed.data
  return prisma.student.update({
    where: { id },
    data: updateData,
  })
}

export async function updateStudentInterests(
  studentId: string,
  interests: string[]
) {
  await requireParentOfStudent(studentId)

  if (interests.length > 10) throw new Error("Maximum 10 interests allowed")

  const cleaned = interests
    .map((i) => i.trim().toLowerCase())
    .filter((i) => i.length > 0 && i.length <= 50)

  return prisma.student.update({
    where: { id: studentId },
    data: { interests: cleaned },
  })
}

export async function startLesson(studentId: string, lessonId: string) {
  const parsed = startLessonSchema.safeParse({ studentId, lessonId })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  await requireParentOfStudent(parsed.data.studentId)

  return prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId: parsed.data.studentId, lessonId: parsed.data.lessonId } },
    update: { status: LessonStatus.IN_PROGRESS },
    create: { studentId: parsed.data.studentId, lessonId: parsed.data.lessonId, status: LessonStatus.IN_PROGRESS },
  })
}

export async function completeLesson(
  studentId: string,
  lessonId: string,
  score: number
) {
  const parsed = completeLessonSchema.safeParse({ studentId, lessonId, score })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  await requireParentOfStudent(parsed.data.studentId)

  const xpAwarded = Math.round(parsed.data.score * 1.5)

  await prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId: parsed.data.studentId, lessonId: parsed.data.lessonId } },
    update: { status: LessonStatus.COMPLETED, score: parsed.data.score, completedAt: new Date() },
    create: {
      studentId: parsed.data.studentId,
      lessonId: parsed.data.lessonId,
      status: LessonStatus.COMPLETED,
      score: parsed.data.score,
      completedAt: new Date(),
    },
  })

  await prisma.student.update({
    where: { id: parsed.data.studentId },
    data: { xp: { increment: xpAwarded } },
  })

  const completedCount = await prisma.lessonProgress.count({
    where: { studentId: parsed.data.studentId, status: LessonStatus.COMPLETED },
  })

  if (completedCount >= 5) {
    await prisma.achievement.upsert({
      where: { studentId_achievementId: { studentId: parsed.data.studentId, achievementId: "quick-learner" } },
      update: {},
      create: { studentId: parsed.data.studentId, achievementId: "quick-learner" },
    })
  }

  const perfectScore = parsed.data.score >= 100
  if (perfectScore) {
    await prisma.achievement.upsert({
      where: { studentId_achievementId: { studentId: parsed.data.studentId, achievementId: "sharpshooter" } },
      update: {},
      create: { studentId: parsed.data.studentId, achievementId: "sharpshooter" },
    })
  }

  const student = await prisma.student.findUnique({ where: { id: parsed.data.studentId } })
  if (student && student.xp >= 1000) {
    await prisma.achievement.upsert({
      where: { studentId_achievementId: { studentId: parsed.data.studentId, achievementId: "super-star" } },
      update: {},
      create: { studentId: parsed.data.studentId, achievementId: "super-star" },
    })
  }

  return { xpAwarded }
}

export async function submitGameScore(
  studentId: string,
  gameId: string,
  score: number,
  xpEarned: number
) {
  const parsed = submitGameScoreSchema.safeParse({ studentId, gameId, score, xpEarned })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  await requireParentOfStudent(parsed.data.studentId)

  await prisma.gameScore.create({
    data: {
      studentId: parsed.data.studentId,
      gameId: parsed.data.gameId,
      score: parsed.data.score,
      xpEarned: parsed.data.xpEarned,
    },
  })

  await prisma.student.update({
    where: { id: parsed.data.studentId },
    data: { xp: { increment: parsed.data.xpEarned } },
  })

  return { success: true }
}
