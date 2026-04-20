import { test, expect } from '@playwright/test'

test.describe('Authentication flow', () => {
    test('visiting / without session redirects to /login', async ({ page }) => {
        // Clear any stored session state
        await page.context().clearCookies()
        await page.goto('/')
        await expect(page).toHaveURL('/login')
    })

    test('login form is visible on /login', async ({ page }) => {
        await page.goto('/login')
        await expect(page.getByLabel('E-mailadres')).toBeVisible()
        await expect(page.getByRole('textbox', { name: 'Wachtwoord' })).toBeVisible()
        await expect(page.getByRole('button', { name: /inloggen/i })).toBeVisible()
    })

    test('login with valid credentials redirects to /', async ({ page }) => {
        await page.goto('/login', { waitUntil: 'networkidle' })
        await page.getByLabel('E-mailadres').fill('j.devries@basworld.com')
        await page.getByRole('textbox', { name: 'Wachtwoord' }).fill('onderdelen123')
        await page.getByRole('button', { name: /inloggen/i }).click()
        await expect(page).toHaveURL('/', { timeout: 10_000 })
    })
})
