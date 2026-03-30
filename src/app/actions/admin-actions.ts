"use server"

import prisma from "@/lib/prisma"

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } })
  return { success: true }
}

export async function updateUserRole(userId: string, role: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
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
  return prisma.subject.create({ data })
}

export async function createModule(data: {
  title: string
  description?: string
  order?: number
  subjectId: string
}) {
  return prisma.module.create({ data })
}

export async function createLesson(data: {
  title: string
  description?: string
  duration?: number
  order?: number
  moduleId: string
}) {
  return prisma.lesson.create({ data })
}
