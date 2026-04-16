import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
    await page.goto('/login')
    await page.getByLabel('Email').fill('j.devries@basworld.com')
    await page.getByLabel('Password').fill('onderdelen123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/', { timeout: 10_000 })
}

test.describe('Search and filter', () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test('typing in the search box narrows results', async ({ page }) => {
        await page.goto('/')

        // Wait for initial parts to load
        const countText = page.locator('p').filter({ hasText: /parts found/ })
        await expect(countText).toBeVisible()
        const initialText = await countText.textContent()
        const initialCount = parseInt(initialText?.match(/\d+/)?.[0] ?? '0', 10)

        // Type a specific search term
        await page.getByLabel('Search parts by name or OEM number').fill('bumper')

        // Wait for the count to update (debounce + fetch)
        await expect(countText).not.toHaveText(String(initialCount), { timeout: 5_000 })
        const filteredText = await countText.textContent()
        const filteredCount = parseInt(filteredText?.match(/\d+/)?.[0] ?? '0', 10)
        expect(filteredCount).toBeLessThan(initialCount)
    })

    test('clearing the search resets results', async ({ page }) => {
        await page.goto('/')

        const countText = page.locator('p').filter({ hasText: /parts found/ })
        await expect(countText).toBeVisible()
        const initialText = await countText.textContent()

        await page.getByLabel('Search parts by name or OEM number').fill('bumper')
        // Wait for narrowed results
        await expect(countText).not.toHaveText(initialText ?? '', { timeout: 5_000 })

        // Clear via the X button
        await page.getByRole('button', { name: /clear search/i }).click()

        // Results should return to original count
        await expect(countText).toHaveText(initialText ?? '', { timeout: 5_000 })
    })

    test('selecting a brand filter changes the result count', async ({ page }) => {
        await page.goto('/')

        const countText = page.locator('p').filter({ hasText: /parts found/ })
        await expect(countText).toBeVisible()
        const initialText = await countText.textContent()

        // Click the DAF brand checkbox
        await page.getByRole('checkbox', { name: 'DAF' }).check()

        await expect(countText).not.toHaveText(initialText ?? '', { timeout: 5_000 })
        const filteredText = await countText.textContent()
        const filteredCount = parseInt(filteredText?.match(/\d+/)?.[0] ?? '0', 10)
        expect(filteredCount).toBeGreaterThan(0)
    })
})
