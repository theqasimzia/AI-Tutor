import { describe, it, expect } from "vitest"
import {
  loginSchema,
  signupSchema,
  updateStudentProfileSchema,
  startLessonSchema,
  completeLessonSchema,
  submitGameScoreSchema,
  addChildSchema,
  updateParentProfileSchema,
  deleteUserSchema,
  updateUserRoleSchema,
  createSubjectSchema,
  createModuleSchema,
  createLessonSchema,
} from "@/lib/validations"

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "parent@example.com",
      password: "password123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing email", () => {
    const result = loginSchema.safeParse({ email: "", password: "password123" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "parent@example.com",
      password: "",
    })
    expect(result.success).toBe(false)
  })
})

describe("signupSchema", () => {
  const validData = {
    parentName: "Jane Doe",
    email: "jane@example.com",
    password: "Passw0rd",
    children: [{ yearGroup: "Year 5" }],
  }

  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it("normalises email to lowercase", () => {
    const result = signupSchema.safeParse({
      ...validData,
      email: "Jane@Example.COM",
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe("jane@example.com")
    }
  })

  it("rejects short name", () => {
    const result = signupSchema.safeParse({ ...validData, parentName: "J" })
    expect(result.success).toBe(false)
  })

  it("rejects password without uppercase", () => {
    const result = signupSchema.safeParse({
      ...validData,
      password: "password1",
    })
    expect(result.success).toBe(false)
  })

  it("rejects password without lowercase", () => {
    const result = signupSchema.safeParse({
      ...validData,
      password: "PASSWORD1",
    })
    expect(result.success).toBe(false)
  })

  it("rejects password without number", () => {
    const result = signupSchema.safeParse({
      ...validData,
      password: "Password",
    })
    expect(result.success).toBe(false)
  })

  it("rejects password shorter than 8 chars", () => {
    const result = signupSchema.safeParse({ ...validData, password: "Pass1" })
    expect(result.success).toBe(false)
  })

  it("requires at least one child", () => {
    const result = signupSchema.safeParse({ ...validData, children: [] })
    expect(result.success).toBe(false)
  })

  it("rejects more than 10 children", () => {
    const children = Array.from({ length: 11 }, () => ({ yearGroup: "Year 3" }))
    const result = signupSchema.safeParse({ ...validData, children })
    expect(result.success).toBe(false)
  })
})

describe("updateStudentProfileSchema", () => {
  it("accepts valid profile update", () => {
    const result = updateStudentProfileSchema.safeParse({
      studentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      name: "New Name",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid CUID", () => {
    const result = updateStudentProfileSchema.safeParse({
      studentId: "bad-id",
      name: "New Name",
    })
    expect(result.success).toBe(false)
  })
})

describe("startLessonSchema", () => {
  it("accepts valid IDs", () => {
    const result = startLessonSchema.safeParse({
      studentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      lessonId: "clyyyyyyyyyyyyyyyyyyyyyyy",
    })
    expect(result.success).toBe(true)
  })
})

describe("completeLessonSchema", () => {
  it("accepts valid completion data", () => {
    const result = completeLessonSchema.safeParse({
      studentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      lessonId: "clyyyyyyyyyyyyyyyyyyyyyyy",
      score: 85,
    })
    expect(result.success).toBe(true)
  })

  it("rejects score above 100", () => {
    const result = completeLessonSchema.safeParse({
      studentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      lessonId: "clyyyyyyyyyyyyyyyyyyyyyyy",
      score: 150,
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative score", () => {
    const result = completeLessonSchema.safeParse({
      studentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      lessonId: "clyyyyyyyyyyyyyyyyyyyyyyy",
      score: -5,
    })
    expect(result.success).toBe(false)
  })
})

describe("submitGameScoreSchema", () => {
  it("accepts valid game score", () => {
    const result = submitGameScoreSchema.safeParse({
      studentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      gameId: "math-blaster",
      score: 1200,
      xpEarned: 50,
    })
    expect(result.success).toBe(true)
  })

  it("rejects unknown game ID", () => {
    const result = submitGameScoreSchema.safeParse({
      studentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      gameId: "unknown-game",
      score: 100,
      xpEarned: 10,
    })
    expect(result.success).toBe(false)
  })
})

describe("addChildSchema", () => {
  it("accepts valid child", () => {
    const result = addChildSchema.safeParse({
      parentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Alice",
      grade: "Year 5",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid year group", () => {
    const result = addChildSchema.safeParse({
      parentId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Alice",
      grade: "Year 1",
    })
    expect(result.success).toBe(false)
  })
})

describe("updateParentProfileSchema", () => {
  it("accepts valid update", () => {
    const result = updateParentProfileSchema.safeParse({
      userId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Jane Smith",
    })
    expect(result.success).toBe(true)
  })
})

describe("deleteUserSchema", () => {
  it("requires valid CUID", () => {
    const result = deleteUserSchema.safeParse({ userId: "not-a-cuid" })
    expect(result.success).toBe(false)
  })
})

describe("updateUserRoleSchema", () => {
  it("accepts valid role", () => {
    const result = updateUserRoleSchema.safeParse({
      userId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      role: "ADMIN",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid role", () => {
    const result = updateUserRoleSchema.safeParse({
      userId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      role: "STUDENT",
    })
    expect(result.success).toBe(false)
  })
})

describe("createSubjectSchema", () => {
  it("accepts valid subject", () => {
    const result = createSubjectSchema.safeParse({
      name: "Mathematics",
      slug: "mathematics",
      keyStage: "KS2",
    })
    expect(result.success).toBe(true)
  })

  it("rejects slug with spaces", () => {
    const result = createSubjectSchema.safeParse({
      name: "Mathematics",
      slug: "my subject",
      keyStage: "KS2",
    })
    expect(result.success).toBe(false)
  })
})

describe("createModuleSchema", () => {
  it("accepts valid module", () => {
    const result = createModuleSchema.safeParse({
      title: "Fractions",
      subjectId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    })
    expect(result.success).toBe(true)
  })
})

describe("createLessonSchema", () => {
  it("accepts valid lesson", () => {
    const result = createLessonSchema.safeParse({
      title: "Adding Fractions",
      moduleId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      duration: 30,
    })
    expect(result.success).toBe(true)
  })

  it("rejects duration over 300", () => {
    const result = createLessonSchema.safeParse({
      title: "Long Lesson",
      moduleId: "clxxxxxxxxxxxxxxxxxxxxxxx",
      duration: 500,
    })
    expect(result.success).toBe(false)
  })
})
