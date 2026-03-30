"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  deleteUserSchema,
  updateUserRoleSchema,
  createSubjectSchema,
  createModuleSchema,
  createLessonSchema,
} from "@/lib/validations"

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: admin access required")
  }
  return session
}

export async function deleteUser(userId: string) {
  await requireAdmin()
  const parsed = deleteUserSchema.safeParse({ userId })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  await prisma.user.delete({ where: { id: parsed.data.userId } })
  return { success: true }
}

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin()
  const parsed = updateUserRoleSchema.safeParse({ userId, role })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  return prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
  })
}

export async function createSubject(data: {
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  keyStage: string
  order?: number
}) {
  await requireAdmin()
  const parsed = createSubjectSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  return prisma.subject.create({ data: parsed.data })
}

export async function createModule(data: {
  title: string
  description?: string
  order?: number
  subjectId: string
}) {
  await requireAdmin()
  const parsed = createModuleSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  return prisma.module.create({ data: parsed.data })
}

export async function createLesson(data: {
  title: string
  description?: string
  duration?: number
  order?: number
  moduleId: string
}) {
  await requireAdmin()
  const parsed = createLessonSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  return prisma.lesson.create({ data: parsed.data })
}
