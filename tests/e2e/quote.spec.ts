import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
    await page.goto('/login')
    await page.getByLabel('Email').fill('j.devries@basworld.com')
    await page.getByLabel('Password').fill('onderdelen123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/', { timeout: 10_000 })
}

test.describe('Quote flow', () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
        // Clear localStorage quote state so each test starts fresh
        await page.evaluate(() => localStorage.removeItem('quote-items'))
    })

    test('add a part to quote from the detail page', async ({ page }) => {
        await page.goto('/parts/DAF-2119711')
        await expect(page.getByRole('heading', { name: 'DAF XF105 Front Bumper' })).toBeVisible()

        const addBtn = page.getByRole('button', { name: /add to quote/i })
        await expect(addBtn).toBeVisible()
        await addBtn.click()

        // Button label changes after adding
        await expect(page.getByRole('button', { name: /in quote/i })).toBeVisible()
    })

    test('/quote shows the added part', async ({ page }) => {
        await page.goto('/parts/DAF-2119711')
        await page.getByRole('button', { name: /add to quote/i }).click()
        await expect(page.getByRole('button', { name: /in quote/i })).toBeVisible()

        await page.goto('/quote')
        await expect(page.getByText('DAF XF105 Front Bumper')).toBeVisible()
    })

    test('removing an item from /quote shows empty state', async ({ page }) => {
        await page.goto('/parts/DAF-2119711')
        await page.getByRole('button', { name: /add to quote/i }).click()
        await page.goto('/quote')

        // Find and click the remove button for the row
        const removeBtn = page.getByRole('button', { name: /remove/i }).first()
        await removeBtn.click()

        await expect(page.getByText('Your quote list is empty')).toBeVisible()
    })
})
