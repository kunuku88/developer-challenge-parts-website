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
        await expect(page.getByLabel('Email')).toBeVisible()
        await expect(page.getByLabel('Password')).toBeVisible()
        await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    })

    test('login with valid credentials redirects to /', async ({ page }) => {
        await page.goto('/login')
        await page.getByLabel('Email').fill('j.devries@basworld.com')
        await page.getByLabel('Password').fill('onderdelen123')
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page).toHaveURL('/', { timeout: 10_000 })
    })

    test('login with invalid credentials shows an error message', async ({ page }) => {
        await page.goto('/login')
        await page.getByLabel('Email').fill('wrong@example.com')
        await page.getByLabel('Password').fill('badpassword')
        await page.getByRole('button', { name: /sign in/i }).click()
        await expect(page.getByRole('alert')).toBeVisible({ timeout: 5_000 })
    })
})
