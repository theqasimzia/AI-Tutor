import { test, expect } from "@playwright/test"

test.describe("Smoke tests", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/AI Tutor Academy/)
    await expect(page.getByRole("link", { name: /get started/i })).toBeVisible()
  })

  test("login page loads", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible()
    await expect(page.getByLabel(/email/i).first()).toBeVisible()
  })

  test("signup page loads", async ({ page }) => {
    await page.goto("/signup")
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible()
  })

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy")
    await expect(page.getByRole("heading", { name: /privacy policy/i })).toBeVisible()
  })

  test("protected routes redirect to login", async ({ page }) => {
    await page.goto("/student/dashboard")
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain("/login")
  })

  test("health endpoint responds", async ({ request }) => {
    const response = await request.get("/api/health")
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.status).toBe("healthy")
  })
})

test.describe("Auth flow", () => {
  test("shows validation errors on empty login", async ({ page }) => {
    await page.goto("/login")
    const emailInput = page.getByLabel(/email/i).first()
    const passwordInput = page.getByLabel(/password/i).first()

    await emailInput.fill("")
    await passwordInput.fill("")
    await page.getByRole("button", { name: /login as student/i }).click()

    await expect(page.locator("text=Please enter a valid email address").or(page.locator("text=Password is required"))).toBeVisible()
  })
})
