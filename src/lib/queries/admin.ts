"use server"

import prisma from "@/lib/prisma"
import { LessonStatus, Role } from "@prisma/client"

export async function getAdminDashboardStats() {
  const [totalUsers, totalStudents, totalCompletedLessons, recentSignups] = await Promise.all([
    prisma.user.count(),
    prisma.student.count(),
    prisma.lessonProgress.count({ where: { status: LessonStatus.COMPLETED } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ])

  return {
    totalUsers,
    totalStudents,
    totalCompletedLessons,
    recentSignups,
  }
}

export async function getAllUsers(search?: string, role?: string) {
  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }
  if (role && Object.values(Role).includes(role as Role)) {
    where.role = role as Role
  }

  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      children: { select: { id: true, name: true } },
    },
  })
}

export async function getSubjectsWithModulesAndLessons() {
  return prisma.subject.findMany({
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
}
