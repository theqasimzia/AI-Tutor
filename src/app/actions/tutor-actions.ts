"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SessionPhase } from "@prisma/client"

export async function createTutorSession(studentId: string, lessonId?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { parentId: true },
  })
  if (!student || student.parentId !== session.user.id) {
    throw new Error("Unauthorized")
  }

  return prisma.tutorSession.create({
    data: {
      studentId,
      lessonId: lessonId ?? null,
      phase: SessionPhase.GREETING,
    },
  })
}

export async function getTutorSession(sessionId: string) {
  return prisma.tutorSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      lesson: { include: { module: { include: { subject: true } } } },
    },
  })
}

export async function updateStudentInterests(
  studentId: string,
  interests: string[]
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { parentId: true },
  })
  if (!student || student.parentId !== session.user.id) {
    throw new Error("Unauthorized")
  }

  return prisma.student.update({
    where: { id: studentId },
    data: { interests },
  })
}
