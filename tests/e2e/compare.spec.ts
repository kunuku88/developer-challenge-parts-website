import { test, expect, type Page } from '@playwright/test'

async function login(page: Page) {
    await page.context().clearCookies()
    await page.goto('/login', { waitUntil: 'networkidle' })
    await page.getByLabel('E-mailadres').fill('j.devries@basworld.com')
    await page.getByRole('textbox', { name: 'Wachtwoord' }).fill('onderdelen123')
    await page.getByRole('button', { name: /inloggen/i }).click()
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
        await page.goto('/', { waitUntil: 'networkidle' })

        await page
            .getByRole('button', { name: 'Add to comparison: DAF XF105 Front Bumper' })
            .click()

        await page.getByRole('button', { name: 'Add to comparison: MAN TGX Engine Mount' }).click()

        await page.getByRole('link', { name: 'View' }).click()

        await expect(page).toHaveURL('/compare')
        await expect(page.getByText('DAF XF105 Front Bumper')).toBeVisible()
        await expect(page.getByText('MAN TGX Engine Mount')).toBeVisible()
    })

    test('removing a part from comparison updates the table', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' })

        await page
            .getByRole('button', { name: 'Add to comparison: DAF XF105 Front Bumper' })
            .click()
        await page.getByRole('button', { name: 'Add to comparison: MAN TGX Engine Mount' }).click()

        await page.getByRole('link', { name: 'View' }).click()
        await expect(page).toHaveURL('/compare')
        await expect(page.getByText('DAF XF105 Front Bumper')).toBeVisible()

        await page.getByRole('button', { name: /remove.*DAF/i }).click()

        await expect(page.getByText('DAF XF105 Front Bumper')).not.toBeVisible({ timeout: 5_000 })
        await expect(page.getByText('MAN TGX Engine Mount')).toBeVisible()
    })
})
