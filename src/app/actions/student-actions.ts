"use server"

import prisma from "@/lib/prisma"
import { getStudentsByParentId } from "@/lib/queries/student"

export async function getStudentsForParent(parentId: string) {
  return getStudentsByParentId(parentId)
}

export async function updateStudentProfile(
  studentId: string,
  data: { name?: string; avatar?: string }
) {
  return prisma.student.update({
    where: { id: studentId },
    data,
  })
}

export async function startLesson(studentId: string, lessonId: string) {
  return prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId, lessonId } },
    update: { status: "IN_PROGRESS" },
    create: { studentId, lessonId, status: "IN_PROGRESS" },
  })
}

export async function completeLesson(
  studentId: string,
  lessonId: string,
  score: number
) {
  const xpAwarded = Math.round(score * 1.5)

  await prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId, lessonId } },
    update: { status: "COMPLETED", score, completedAt: new Date() },
    create: {
      studentId,
      lessonId,
      status: "COMPLETED",
      score,
      completedAt: new Date(),
    },
  })

  await prisma.student.update({
    where: { id: studentId },
    data: { xp: { increment: xpAwarded } },
  })

  // Check for achievement unlocks
  const completedCount = await prisma.lessonProgress.count({
    where: { studentId, status: "COMPLETED" },
  })

  if (completedCount >= 5) {
    await prisma.achievement.upsert({
      where: { studentId_achievementId: { studentId, achievementId: "quick-learner" } },
      update: {},
      create: { studentId, achievementId: "quick-learner" },
    })
  }

  const perfectScore = score >= 100
  if (perfectScore) {
    await prisma.achievement.upsert({
      where: { studentId_achievementId: { studentId, achievementId: "sharpshooter" } },
      update: {},
      create: { studentId, achievementId: "sharpshooter" },
    })
  }

  const student = await prisma.student.findUnique({ where: { id: studentId } })
  if (student && student.xp >= 1000) {
    await prisma.achievement.upsert({
      where: { studentId_achievementId: { studentId, achievementId: "super-star" } },
      update: {},
      create: { studentId, achievementId: "super-star" },
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
  await prisma.gameScore.create({
    data: { studentId, gameId, score, xpEarned },
  })

  await prisma.student.update({
    where: { id: studentId },
    data: { xp: { increment: xpEarned } },
  })

  return { success: true }
}
