import { z } from "zod"

const cuid = z.string().min(1).regex(/^c[a-z0-9]{24,}$/i, "Invalid ID format")

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signupSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
  children: z
    .array(z.object({ yearGroup: z.string() }))
    .min(1, "At least 1 child is required")
    .max(10, "Maximum 10 children allowed"),
  referral: z
    .union([z.string().email("Please enter a valid referral email"), z.literal("")])
    .optional(),
})

export const updateStudentProfileSchema = z.object({
  studentId: cuid,
  name: z
    .string()
    .trim()
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  avatar: z
    .union([z.string().url("Please enter a valid URL"), z.literal("")])
    .optional(),
})

export const startLessonSchema = z.object({
  studentId: cuid,
  lessonId: cuid,
})

export const completeLessonSchema = z.object({
  studentId: cuid,
  lessonId: cuid,
  score: z.number().int().min(0).max(100),
})

export const submitGameScoreSchema = z.object({
  studentId: cuid,
  gameId: z.enum(["math-blaster", "word-wizard", "history-hero"]),
  score: z.number().int().min(0),
  xpEarned: z.number().int().min(0).max(500),
})

const yearGroupValues = [
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
  "Year 7",
  "Year 8",
  "Year 9",
  "year3",
  "year4",
  "year5",
  "year6",
  "year7",
  "year8",
  "year9",
] as const

export const addChildSchema = z.object({
  parentId: cuid,
  name: z
    .string()
    .trim()
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must be at most 100 characters"),
  grade: z.enum(yearGroupValues, {
    message: "Please select a valid year group",
  }),
})

export const updateParentProfileSchema = z.object({
  userId: cuid,
  name: z
    .string()
    .trim()
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must be at most 100 characters")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform((v) => v.toLowerCase())
    .optional(),
})

export const deleteUserSchema = z.object({
  userId: cuid,
})

export const updateUserRoleSchema = z.object({
  userId: cuid,
  role: z.enum(["PARENT", "ADMIN"], {
    message: "Role must be PARENT or ADMIN",
  }),
})

export const createSubjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  description: z.string().max(500).optional(),
  color: z.string().max(50).optional(),
  icon: z.string().max(50).optional(),
  keyStage: z.enum(["KS1", "KS2", "KS3", "KS4"]),
  order: z.number().int().min(0).optional(),
})

export const createModuleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).optional(),
  order: z.number().int().min(0).optional(),
  subjectId: cuid,
})

export const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(500).optional(),
  duration: z.number().int().min(1).max(300).optional(),
  order: z.number().int().min(0).optional(),
  moduleId: cuid,
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type UpdateStudentProfileInput = z.infer<typeof updateStudentProfileSchema>
export type StartLessonInput = z.infer<typeof startLessonSchema>
export type CompleteLessonInput = z.infer<typeof completeLessonSchema>
export type SubmitGameScoreInput = z.infer<typeof submitGameScoreSchema>
export type AddChildInput = z.infer<typeof addChildSchema>
export type UpdateParentProfileInput = z.infer<typeof updateParentProfileSchema>
export type DeleteUserInput = z.infer<typeof deleteUserSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>
export type CreateModuleInput = z.infer<typeof createModuleSchema>
export type CreateLessonInput = z.infer<typeof createLessonSchema>
