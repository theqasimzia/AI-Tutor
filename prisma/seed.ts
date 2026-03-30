import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // --- Users ---
  const adminPassword = await bcrypt.hash("Admin123!", 10)
  const parentPassword = await bcrypt.hash("Parent123!", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@tutorinacademy.com" },
    update: {},
    create: {
      email: "admin@tutorinacademy.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  })
  console.log("Admin user:", admin.email)

  const parent = await prisma.user.upsert({
    where: { email: "parent@demo.com" },
    update: {},
    create: {
      email: "parent@demo.com",
      password: parentPassword,
      name: "Jane Doe",
      role: "PARENT",
    },
  })
  console.log("Parent user:", parent.email)

  // --- Students ---
  const existingJohn = await prisma.student.findFirst({
    where: { parentId: parent.id, name: "John Doe" },
  })
  const john = existingJohn ?? await prisma.student.create({
    data: { name: "John Doe", grade: "Year 5", xp: 1250, parentId: parent.id },
  })

  const existingSarah = await prisma.student.findFirst({
    where: { parentId: parent.id, name: "Sarah Doe" },
  })
  const sarah = existingSarah ?? await prisma.student.create({
    data: { name: "Sarah Doe", grade: "Year 3", xp: 850, parentId: parent.id },
  })
  console.log("Students:", john.name, sarah.name)

  // --- Subjects ---
  const mathSubject = await prisma.subject.upsert({
    where: { slug: "maths-ks2" },
    update: {},
    create: {
      name: "Mathematics",
      slug: "maths-ks2",
      description: "Key Stage 2 Mathematics covering number, geometry, and statistics.",
      color: "blue",
      icon: "Calculator",
      keyStage: "KS2",
      order: 1,
    },
  })

  const englishSubject = await prisma.subject.upsert({
    where: { slug: "english-ks2" },
    update: {},
    create: {
      name: "English",
      slug: "english-ks2",
      description: "Key Stage 2 English covering reading, writing, and grammar.",
      color: "pink",
      icon: "BookOpen",
      keyStage: "KS2",
      order: 2,
    },
  })

  const scienceSubject = await prisma.subject.upsert({
    where: { slug: "science-ks2" },
    update: {},
    create: {
      name: "Science",
      slug: "science-ks2",
      description: "Key Stage 2 Science covering biology, chemistry, and physics.",
      color: "orange",
      icon: "Brain",
      keyStage: "KS2",
      order: 3,
    },
  })
  console.log("Subjects created")

  // --- Helper to upsert modules and lessons ---
  async function seedModule(
    subjectId: string,
    title: string,
    description: string,
    order: number,
    lessons: { title: string; description?: string; duration?: number; order: number }[]
  ) {
    let mod = await prisma.module.findFirst({
      where: { subjectId, title },
    })
    if (!mod) {
      mod = await prisma.module.create({
        data: { title, description, order, subjectId },
      })
    }
    const lessonRecords = []
    for (const l of lessons) {
      let lesson = await prisma.lesson.findFirst({
        where: { moduleId: mod.id, title: l.title },
      })
      if (!lesson) {
        lesson = await prisma.lesson.create({
          data: {
            title: l.title,
            description: l.description,
            duration: l.duration ?? 15,
            order: l.order,
            moduleId: mod.id,
          },
        })
      }
      lessonRecords.push(lesson)
    }
    return { module: mod, lessons: lessonRecords }
  }

  // --- Mathematics Modules (from curriculum.ts) ---
  const mathMod1 = await seedModule(
    mathSubject.id,
    "Number & Place Value",
    "Understanding numbers up to 10,000,000.",
    1,
    [
      { title: "Place Value to 1,000,000", description: "Learn about place value in large numbers.", duration: 20, order: 1 },
      { title: "Rounding Numbers", description: "Round numbers to the nearest 10, 100, 1000.", duration: 15, order: 2 },
      { title: "Negative Numbers", description: "Understand negative numbers and their context.", duration: 15, order: 3 },
    ]
  )

  const mathMod2 = await seedModule(
    mathSubject.id,
    "Calculations",
    "Addition, subtraction, multiplication and division.",
    2,
    [
      { title: "Long Multiplication", description: "Multiply multi-digit numbers.", duration: 20, order: 1 },
      { title: "Long Division", description: "Divide large numbers step by step.", duration: 20, order: 2 },
      { title: "Order of Operations (BODMAS)", description: "Apply BODMAS rules correctly.", duration: 15, order: 3 },
    ]
  )

  const mathMod3 = await seedModule(
    mathSubject.id,
    "Fractions, Decimals & Percentages",
    "Comparing and ordering fractions.",
    3,
    [
      { title: "Simplifying Fractions", description: "Reduce fractions to simplest form.", duration: 15, order: 1 },
      { title: "Adding & Subtracting Fractions", description: "Work with common denominators.", duration: 20, order: 2 },
      { title: "Multiplying Fractions", description: "Multiply fractions and mixed numbers.", duration: 15, order: 3 },
    ]
  )

  // --- English Modules (from curriculum.ts) ---
  const engMod1 = await seedModule(
    englishSubject.id,
    "Grammar & Punctuation",
    "Using modal verbs, relative clauses, and parentheses.",
    1,
    [
      { title: "Relative Clauses", description: "Understand who, which, where, when, whose.", duration: 15, order: 1 },
      { title: "Modal Verbs", description: "Learn can, could, may, might, shall, should.", duration: 15, order: 2 },
      { title: "Active vs Passive Voice", description: "Transform between active and passive sentences.", duration: 15, order: 3 },
    ]
  )

  // --- Science Modules (new) ---
  const sciMod1 = await seedModule(
    scienceSubject.id,
    "Earth & Space",
    "Explore the solar system, planets, and Earth's place in space.",
    1,
    [
      { title: "The Solar System", description: "Learn about the Sun, planets, and moons.", duration: 20, order: 1 },
      { title: "Day and Night", description: "Understand Earth's rotation and its effects.", duration: 15, order: 2 },
      { title: "The Moon & Tides", description: "Explore the Moon's phases and tidal effects.", duration: 15, order: 3 },
    ]
  )
  console.log("Modules and lessons seeded")

  // --- Collect all lessons for progress seeding ---
  const allLessons = [
    ...mathMod1.lessons,
    ...mathMod2.lessons,
    ...mathMod3.lessons,
    ...engMod1.lessons,
    ...sciMod1.lessons,
  ]

  // --- Lesson Progress for John ---
  const progressData: { lessonIdx: number; status: string; score: number }[] = [
    { lessonIdx: 0, status: "COMPLETED", score: 95 },
    { lessonIdx: 1, status: "COMPLETED", score: 88 },
    { lessonIdx: 2, status: "COMPLETED", score: 92 },
    { lessonIdx: 3, status: "COMPLETED", score: 78 },
    { lessonIdx: 4, status: "IN_PROGRESS", score: 0 },
    { lessonIdx: 5, status: "IN_PROGRESS", score: 0 },
    { lessonIdx: 9, status: "COMPLETED", score: 85 },
    { lessonIdx: 10, status: "IN_PROGRESS", score: 0 },
  ]

  for (const p of progressData) {
    if (p.lessonIdx >= allLessons.length) continue
    const lesson = allLessons[p.lessonIdx]
    await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: { studentId: john.id, lessonId: lesson.id },
      },
      update: { status: p.status, score: p.score },
      create: {
        studentId: john.id,
        lessonId: lesson.id,
        status: p.status,
        score: p.score,
        completedAt: p.status === "COMPLETED" ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      },
    })
  }
  console.log("Lesson progress seeded for John")

  // --- Achievements for John ---
  const achievements = [
    { achievementId: "quick-learner", label: "Quick Learner" },
    { achievementId: "streak-7", label: "7-Day Streak" },
    { achievementId: "sharpshooter", label: "Sharpshooter" },
    { achievementId: "super-star", label: "Super Star" },
  ]
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: {
        studentId_achievementId: { studentId: john.id, achievementId: a.achievementId },
      },
      update: {},
      create: {
        studentId: john.id,
        achievementId: a.achievementId,
        unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log("Achievements seeded for John")

  // --- Game Scores for John ---
  const gameScoresData = [
    { gameId: "math-blaster", score: 120, xpEarned: 120 },
    { gameId: "math-blaster", score: 80, xpEarned: 80 },
    { gameId: "word-wizard", score: 150, xpEarned: 150 },
    { gameId: "history-hero", score: 200, xpEarned: 200 },
    { gameId: "history-hero", score: 300, xpEarned: 300 },
  ]
  const existingScores = await prisma.gameScore.count({ where: { studentId: john.id } })
  if (existingScores === 0) {
    for (const gs of gameScoresData) {
      await prisma.gameScore.create({
        data: {
          studentId: john.id,
          gameId: gs.gameId,
          score: gs.score,
          xpEarned: gs.xpEarned,
          playedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
        },
      })
    }
  }
  console.log("Game scores seeded for John")

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
