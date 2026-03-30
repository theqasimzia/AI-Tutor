"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Role } from "@prisma/client"
import { signupSchema } from "@/lib/validations"
import { rateLimit } from "@/lib/rate-limit"

export interface SignupData {
    parentName: string
    email: string
    password: string
    children: { yearGroup: string }[]
    referral?: string
}

export async function registerParent(data: SignupData) {
    const parsed = signupSchema.safeParse(data)
    if (!parsed.success) {
        const firstError = parsed.error.issues[0]
        return { success: false, message: firstError?.message ?? "Invalid input" }
    }

    const validated = parsed.data

    const rl = rateLimit(`signup:${validated.email}`, {
        maxAttempts: 3,
        windowMs: 15 * 60 * 1000,
    })
    if (!rl.success) {
        return {
            success: false,
            message: "Too many signup attempts. Please try again later.",
        }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        })

        if (existingUser) {
            return { success: false, message: "User already exists with this email" }
        }

        const hashedPassword = await bcrypt.hash(validated.password, 10)

        const user = await prisma.user.create({
            data: {
                name: validated.parentName,
                email: validated.email,
                password: hashedPassword,
                role: Role.PARENT,
            },
        })

        if (validated.children && validated.children.length > 0) {
            for (let i = 0; i < validated.children.length; i++) {
                await prisma.student.create({
                    data: {
                        parentId: user.id,
                        name: `Child ${i + 1}`,
                        grade: validated.children[i].yearGroup,
                        xp: 0
                    },
                })
            }
        }

        return { success: true, userId: user.id, message: "Account created successfully!" }
    } catch (e) {
        const { logger } = await import("@/lib/logger")
        logger.error("Registration error", { error: String(e) })
        return { success: false, message: "Failed to create account. Please try again." }
    }
}
