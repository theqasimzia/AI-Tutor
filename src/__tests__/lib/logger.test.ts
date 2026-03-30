import { describe, it, expect, vi } from "vitest"
import { logger } from "@/lib/logger"

describe("logger", () => {
  it("logs info messages", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => {})
    logger.info("test info message")
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain("test info message")
    spy.mockRestore()
  })

  it("logs error messages", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    logger.error("test error", { code: 500 })
    expect(spy).toHaveBeenCalledOnce()
    expect(spy.mock.calls[0][0]).toContain("test error")
    spy.mockRestore()
  })

  it("logs warn messages", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {})
    logger.warn("test warning")
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })

  it("logs debug messages", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {})
    logger.debug("debug msg")
    expect(spy).toHaveBeenCalledOnce()
    spy.mockRestore()
  })
})
