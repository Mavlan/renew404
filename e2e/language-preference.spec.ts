import { expect, test } from '@playwright/test'

test('new English and unsupported-language devices start in English', async ({ browser }) => {
  for (const locale of ['en-US', 'fr-FR']) {
    const context = await browser.newContext({ locale, viewport: { width: 390, height: 844 } })
    const page = await context.newPage()
    await page.goto('http://127.0.0.1:4173/')
    await expect(page.getByRole('heading', { name: 'Know what renews next.' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Add your first service' })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Know what renews next.' })).toBeVisible()
    await context.close()
  }
})

test('a product-link language is applied once and later manual choices survive refresh', async ({ page }) => {
  await page.goto('/?lang=en')
  await expect(page.getByRole('heading', { name: 'Know what renews next.' })).toBeVisible()
  await expect(page).not.toHaveURL(/lang=/)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Know what renews next.' })).toBeVisible()
  await page.getByRole('combobox', { name: 'Language', exact: true }).selectOption('zh-CN')
  await expect(page.getByRole('heading', { name: /每一笔续费，\s*心中有数。/ })).toBeVisible()
  await expect(page.getByRole('combobox', { name: '语言', exact: true })).toBeEnabled()
  await page.reload()
  await expect(page.getByRole('heading', { name: /每一笔续费，\s*心中有数。/ })).toBeVisible()
})
