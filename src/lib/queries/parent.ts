import prisma from "@/lib/prisma"

export async function getParentDashboardData(parentId: string) {
  const children = await prisma.student.findMany({
    where: { parentId },
    include: {
      progress: {
        include: { lesson: { include: { module: { include: { subject: true } } } } },
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  const totalLessons = await prisma.lesson.count()

  const childData = children.map((child) => {
    const completed = child.progress.filter((p) => p.status === "COMPLETED")
    const completionPct = totalLessons > 0 ? Math.round((completed.length / totalLessons) * 100) : 0
    const recentActivity = child.progress[0]

    return {
      id: child.id,
      name: child.name,
      grade: child.grade,
      xp: child.xp,
      completionPct,
      recentActivity: recentActivity
        ? `${recentActivity.status === "COMPLETED" ? "Completed" : "Started"} '${recentActivity.lesson?.title ?? "a lesson"}'`
        : "No activity yet",
    }
  })

  const avgCompletion =
    childData.length > 0
      ? Math.round(childData.reduce((s, c) => s + c.completionPct, 0) / childData.length)
      : 0

  // Recent alerts from all children
  const allProgress = children.flatMap((c) =>
    c.progress
      .filter((p) => p.status === "COMPLETED" && p.completedAt)
      .map((p) => ({
        childName: c.name,
        lessonTitle: p.lesson?.title ?? "a lesson",
        score: p.score,
        completedAt: p.completedAt!,
      }))
  )
  allProgress.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
  const recentAlerts = allProgress.slice(0, 5)

  return {
    childrenCount: children.length,
    avgCompletion,
    children: childData,
    recentAlerts,
  }
}

export async function getChildDetailedProgress(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      progress: {
        include: { lesson: { include: { module: { include: { subject: true } } } } },
        orderBy: { updatedAt: "desc" },
      },
      achievements: true,
    },
  })
  if (!student) return null

  // Per-subject completion
  const subjects = await prisma.subject.findMany({
    include: { modules: { include: { lessons: true } } },
  })

  const subjectProgress = subjects.map((subject) => {
    const subjectLessonIds = subject.modules.flatMap((m) => m.lessons.map((l) => l.id))
    const completed = student.progress.filter(
      (p) => subjectLessonIds.includes(p.lessonId) && p.status === "COMPLETED"
    ).length
    const total = subjectLessonIds.length
    return {
      subject: subject.name,
      color: subject.color,
      completionPct: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  })

  const recentLessons = student.progress.slice(0, 10).map((p) => ({
    title: p.lesson?.title ?? "Unknown",
    score: p.score,
    status: p.status,
    completedAt: p.completedAt,
  }))

  return {
    student: { id: student.id, name: student.name, grade: student.grade, xp: student.xp },
    subjectProgress,
    recentLessons,
    achievements: student.achievements,
  }
}
