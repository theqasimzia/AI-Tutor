import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    // In development we reuse the same client to avoid hot‑reload issues
    if (!globalThis.__prisma) {
        globalThis.__prisma = new PrismaClient()
    }
    prisma = globalThis.__prisma
}

export default prisma

// Optional: expose global for debugging
if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    globalThis.prisma = prisma
}

// Global declaration for TypeScript (optional, for debugging)
declare global {
    var prisma: PrismaClient | undefined
}

if (process.env.NODE_ENV !== 'production') {
    // @ts-ignore
    globalThis.prisma = prisma
}
