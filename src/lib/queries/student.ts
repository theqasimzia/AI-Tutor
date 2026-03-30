import prisma from "@/lib/prisma"

export async function getStudentsByParentId(parentId: string) {
  return prisma.student.findMany({
    where: { parentId },
    select: { id: true, name: true, grade: true, xp: true, avatar: true },
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

  const completedLessons = student.progress.filter((p) => p.status === "COMPLETED")
  const recentLessons = student.progress.slice(0, 5)

  // Weekly XP: sum scores from this week's completed lessons
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const weeklyXp = completedLessons
    .filter((p) => p.completedAt && p.completedAt >= weekStart)
    .reduce((sum, p) => sum + p.score, 0)

  // Streak: consecutive days with completed lessons counting back from today
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

  // Average accuracy
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
