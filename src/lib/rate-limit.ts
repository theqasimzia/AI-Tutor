interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  reset: Date
}

const store = new Map<string, RateLimitEntry>()

let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 60_000

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key)
    }
  }
}

export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup()

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + config.windowMs
    store.set(key, { count: 1, resetAt })
    return {
      success: true,
      remaining: config.maxAttempts - 1,
      reset: new Date(resetAt),
    }
  }

  entry.count++
  store.set(key, entry)

  if (entry.count > config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      reset: new Date(entry.resetAt),
    }
  }

  return {
    success: true,
    remaining: config.maxAttempts - entry.count,
    reset: new Date(entry.resetAt),
  }
}
