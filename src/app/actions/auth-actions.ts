"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export interface SignupData {
    parentName: string
    email: string
    password: string
    children: { yearGroup: string }[]
    referral?: string
}

export async function registerParent(data: SignupData) {
    if (!data.email || !data.password || !data.parentName) {
        return { success: false, message: "Missing required fields" }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existingUser) {
            return { success: false, message: "User already exists with this email" }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await prisma.user.create({
            data: {
                name: data.parentName,
                email: data.email,
                password: hashedPassword,
                role: "PARENT",
            },
        })

        // Create students for each child
        if (data.children && data.children.length > 0) {
            for (let i = 0; i < data.children.length; i++) {
                await prisma.student.create({
                    data: {
                        parentId: user.id,
                        name: `Child ${i + 1}`,
                        grade: data.children[i].yearGroup,
                        xp: 0
                    },
                })
            }
        }

        return { success: true, userId: user.id, message: "Account created successfully!" }
    } catch (e) {
        console.error("Registration error:", e)
        return { success: false, message: "Failed to create account. Please try again." }
    }
}
