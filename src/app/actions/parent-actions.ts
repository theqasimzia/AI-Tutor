"use server"

import prisma from "@/lib/prisma"

export async function addChild(
  parentId: string,
  data: { name: string; grade: string }
) {
  return prisma.student.create({
    data: {
      parentId,
      name: data.name,
      grade: data.grade,
      xp: 0,
    },
  })
}

export async function updateParentProfile(
  userId: string,
  data: { name?: string; email?: string }
) {
  return prisma.user.update({
    where: { id: userId },
    data,
  })
}
