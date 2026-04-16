import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
    await page.goto('/login')
    await page.getByLabel('Email').fill('j.devries@basworld.com')
    await page.getByLabel('Password').fill('onderdelen123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/', { timeout: 10_000 })
}

test.describe('Part comparison', () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test('/compare shows empty state when no parts are selected', async ({ page }) => {
        await page.goto('/compare')
        await expect(page.getByText('No parts selected for comparison')).toBeVisible()
    })

    test('adding two parts to compare and navigating to /compare shows both', async ({ page }) => {
        // Add first part
        await page.goto('/parts/DAF-2119711')
        await expect(page.getByRole('heading', { name: 'DAF XF105 Front Bumper' })).toBeVisible()
        await page.getByRole('button', { name: /compare/i }).click()

        // Add second part
        await page.goto('/parts/MAN-81610100044')
        await expect(page.getByRole('heading', { name: 'MAN TGX Engine Mount' })).toBeVisible()
        await page.getByRole('button', { name: /compare/i }).click()

        // Navigate to compare page
        await page.goto('/compare')

        await expect(page.getByText('DAF XF105 Front Bumper')).toBeVisible()
        await expect(page.getByText('MAN TGX Engine Mount')).toBeVisible()
    })

    test('removing a part from comparison updates the table', async ({ page }) => {
        await page.goto('/parts/DAF-2119711')
        await page.getByRole('button', { name: /compare/i }).click()
        await page.goto('/parts/MAN-81610100044')
        await page.getByRole('button', { name: /compare/i }).click()

        await page.goto('/compare')
        await expect(page.getByText('DAF XF105 Front Bumper')).toBeVisible()

        // Remove first part via the × button in the compare table header
        await page.getByRole('button', { name: /remove.*DAF/i }).click()

        await expect(page.getByText('DAF XF105 Front Bumper')).not.toBeVisible({ timeout: 5_000 })
        await expect(page.getByText('MAN TGX Engine Mount')).toBeVisible()
    })
})
