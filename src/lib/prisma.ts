import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

declare global {
    var __prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    // In development we reuse the same client to avoid hot‑reload issues
    if (!global.__prisma) {
        global.__prisma = new PrismaClient()
    }
    prisma = global.__prisma
}

export default prisma
