"use server"

import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addChildSchema, updateParentProfileSchema } from "@/lib/validations"

export async function addChild(
  parentId: string,
  data: { name: string; grade: string }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.id !== parentId) {
    throw new Error("Unauthorized")
  }

  const parsed = addChildSchema.safeParse({ parentId, ...data })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  return prisma.student.create({
    data: {
      parentId: parsed.data.parentId,
      name: parsed.data.name,
      grade: parsed.data.grade,
      xp: 0,
    },
  })
}

export async function updateParentProfile(
  userId: string,
  data: { name?: string; email?: string }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized")
  }

  const parsed = updateParentProfileSchema.safeParse({ userId, ...data })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input")

  const { userId: id, ...updateData } = parsed.data
  return prisma.user.update({
    where: { id },
    data: updateData,
  })
}
