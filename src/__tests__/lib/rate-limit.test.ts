import { describe, it, expect, beforeEach, vi } from "vitest"
import { rateLimit } from "@/lib/rate-limit"

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("allows requests within limit", () => {
    const config = { maxAttempts: 3, windowMs: 60_000 }
    const r1 = rateLimit("test-key-1", config)
    expect(r1.success).toBe(true)
    expect(r1.remaining).toBe(2)
  })

  it("blocks after exceeding max attempts", () => {
    const config = { maxAttempts: 2, windowMs: 60_000 }
    const key = "test-key-2"

    rateLimit(key, config)
    rateLimit(key, config)
    const r3 = rateLimit(key, config)

    expect(r3.success).toBe(false)
    expect(r3.remaining).toBe(0)
  })

  it("resets after window expires", () => {
    const config = { maxAttempts: 1, windowMs: 1_000 }
    const key = "test-key-3"

    rateLimit(key, config)
    const blocked = rateLimit(key, config)
    expect(blocked.success).toBe(false)

    vi.advanceTimersByTime(1_500)

    const allowed = rateLimit(key, config)
    expect(allowed.success).toBe(true)
  })

  it("tracks separate keys independently", () => {
    const config = { maxAttempts: 1, windowMs: 60_000 }

    rateLimit("key-a", config)
    rateLimit("key-a", config)
    const resultA = rateLimit("key-a", config)

    const resultB = rateLimit("key-b", config)

    expect(resultA.success).toBe(false)
    expect(resultB.success).toBe(true)
  })
})
