import { expect, test, type Page } from '@playwright/test'

async function addService(page: Page, name = 'ChatGPT Plus') {
  await page.goto('/')
  await page.getByRole('link', { name: '添加第一个服务' }).click()
  await page.getByLabel('名称 *').fill(name)
  await page.getByLabel('分类', { exact: true }).selectOption('ai-creative')
  await page.getByLabel('金额 *').fill('20.00')
  await page.getByLabel('货币').selectOption('USD')
  await page.getByLabel('下一次续费日期 *').fill('2026-08-31')
  await page.getByRole('button', { name: '保存服务' }).click()
  await expect(page.getByRole('heading', { name })).toBeVisible()
}

async function chooseChatGPT(page: Page) {
  await page.getByRole('button', { name: '打开服务库' }).click()
  await page.getByLabel('搜索常用服务').fill('OpenAI')
  await page.getByRole('button', { name: /ChatGPT.*AI 与创作/ }).click()
}

test('PWA 独立模式首帧显示品牌开屏并在约 2.2 秒后进入应用', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window)
    window.matchMedia = (query: string) => {
      if (query !== '(display-mode: standalone)') return nativeMatchMedia(query)
      return {
        matches: true,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
      }
    }
  })
  const startedAt = Date.now()
  await page.goto('/')
  const launchScreen = page.locator('#renew404-launch')
  await expect(launchScreen).toBeVisible()
  await expect(launchScreen).toContainText('RENEW404')
  await expect(launchScreen).toContainText('周期有迹 · 续费有期')
  await expect(launchScreen).toBeHidden({ timeout: 3200 })
  const elapsed = Date.now() - startedAt
  expect(elapsed).toBeGreaterThanOrEqual(2000)
  expect(elapsed).toBeLessThan(3200)
  await expect(page.locator('html')).not.toHaveClass(/launch-pending/)
})

test('移动端导航精确高亮、模板抽屉可滚动且表单聚焦不触发缩放', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/services/new')

  await expect(page.getByRole('link', { name: '本月' })).not.toHaveClass(/is-selected/)
  await expect(page.getByRole('link', { name: '服务' })).toHaveClass(/is-selected/)
  await expect(page.getByRole('link', { name: '服务' }).locator('.nav-icon')).toHaveAttribute('data-icon', 'wallet-cards')
  await expect(page.getByRole('link', { name: '统计' }).locator('.nav-icon')).toHaveAttribute('data-icon', 'chart-columns')
  const dateFontSize = await page.getByLabel('下一次续费日期 *').evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  )
  expect(dateFontSize).toBeGreaterThanOrEqual(16)
  const dateLayout = await page.getByLabel('下一次续费日期 *').evaluate((element) => {
    const input = element.getBoundingClientRect()
    const field = element.closest('.field')!.getBoundingClientRect()
    const styles = getComputedStyle(element)
    return {
      inputWidth: input.width,
      inputRight: input.right,
      fieldWidth: field.width,
      fieldRight: field.right,
      paddingLeft: Number.parseFloat(styles.paddingLeft),
      paddingRight: Number.parseFloat(styles.paddingRight),
    }
  })
  const timeBox = await page.getByLabel('提醒时间').boundingBox()
  const zoneBox = await page.getByLabel('时区').boundingBox()
  const timePadding = await page.getByLabel('提醒时间').evaluate((element) => {
    const styles = getComputedStyle(element)
    return [Number.parseFloat(styles.paddingLeft), Number.parseFloat(styles.paddingRight)]
  })
  expect(dateLayout.inputWidth).toBeLessThanOrEqual(dateLayout.fieldWidth)
  expect(dateLayout.inputRight).toBeLessThanOrEqual(dateLayout.fieldRight)
  expect([dateLayout.paddingLeft, dateLayout.paddingRight]).toEqual([0, 0])
  expect(timePadding).toEqual([0, 0])
  expect(timeBox!.x + timeBox!.width).toBeLessThan(zoneBox!.x)

  await page.getByRole('button', { name: '打开服务库' }).click()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  const categoryBar = await page.locator('.template-categories').evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    buttonHeights: Array.from(element.querySelectorAll('button')).map(
      (button) => button.getBoundingClientRect().height,
    ),
  }))
  expect(categoryBar.height).toBeLessThanOrEqual(42)
  expect(categoryBar.buttonHeights.every((height) => height === 38)).toBe(true)
  const pickerRows = await page.evaluate(() => {
    const categories = document.querySelector('.template-categories')!.getBoundingClientRect()
    const results = document.querySelector('.template-results')!.getBoundingClientRect()
    return {
      categoriesBottom: categories.bottom,
      resultsTop: results.top,
      resultsHeight: results.height,
    }
  })
  expect(pickerRows.resultsTop).toBeGreaterThan(pickerRows.categoriesBottom)
  expect(pickerRows.resultsHeight).toBeGreaterThan(300)
  const scrollState = await page.locator('.template-results').evaluate((element) => {
    element.scrollTop = element.scrollHeight
    return { top: element.scrollTop, height: element.clientHeight, total: element.scrollHeight }
  })
  expect(scrollState.total).toBeGreaterThan(scrollState.height)
  expect(scrollState.top).toBeGreaterThan(0)
  await page.getByRole('button', { name: '关闭服务选择器' }).click()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')

  await page.getByRole('link', { name: '设置' }).click()
  await expect(page.getByRole('link', { name: '本月' })).not.toHaveClass(/is-selected/)
  await expect(page.getByRole('link', { name: '设置' })).toHaveClass(/is-selected/)
})

test('手机端可搜索并选择 SurferCloud 模板', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/services/new')
  await page.getByRole('button', { name: '打开服务库' }).click()
  await page.getByLabel('搜索常用服务').fill('sufe')
  const surfercloudOption = page.getByRole('button', { name: /SurferCloud.*云服务与服务器/ })
  const searchResultLayout = await page.evaluate(() => {
    const results = document.querySelector('.template-results')!.getBoundingClientRect()
    const option = document.querySelector('.template-option')!.getBoundingClientRect()
    return {
      resultsTop: results.top,
      resultsBottom: results.bottom,
      optionTop: option.top,
      optionBottom: option.bottom,
    }
  })
  expect(searchResultLayout.optionTop - searchResultLayout.resultsTop).toBeLessThanOrEqual(1)
  expect(searchResultLayout.optionBottom).toBeLessThan(searchResultLayout.resultsBottom)
  await surfercloudOption.click()

  await expect(page.getByLabel('名称 *')).toHaveValue('SurferCloud')
  await expect(page.getByLabel('分类', { exact: true })).toHaveValue('cloud-servers')
  await expect(page.getByLabel('官网链接')).toHaveValue('https://www.surfercloud.com/')
  await expect(page.getByLabel('金额 *')).toHaveValue('')
  await expect(page.getByLabel('下一次续费日期 *')).toHaveValue('')
  await expect(page.getByTestId('selected-template-preview').getByTestId('brand-logo')).toBeVisible()
})

test('手机端可搜索并选择 ExtraVM 模板', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/services/new')
  await page.getByRole('button', { name: '打开服务库' }).click()
  await page.getByLabel('搜索常用服务').fill('Extra VM')
  const extravmOption = page.getByRole('button', { name: /ExtraVM.*云服务与服务器/ })
  await expect(extravmOption).toBeVisible()
  await expect(extravmOption.getByTestId('brand-logo')).toBeVisible()
  await extravmOption.click()

  await expect(page.getByLabel('名称 *')).toHaveValue('ExtraVM')
  await expect(page.getByLabel('分类', { exact: true })).toHaveValue('cloud-servers')
  await expect(page.getByLabel('官网链接')).toHaveValue('https://extravm.com/')
  await expect(page.getByLabel('金额 *')).toHaveValue('')
  await expect(page.getByLabel('下一次续费日期 *')).toHaveValue('')
  await expect(page.getByTestId('selected-template-preview').getByTestId('brand-logo')).toBeVisible()
})

test('手机端可由 ChatGPT 模板新增、编辑并保存，且隐私字段保持为空', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('link', { name: '添加第一个服务' }).click()
  await chooseChatGPT(page)

  await expect(page.getByLabel('名称 *')).toHaveValue('ChatGPT')
  await expect(page.getByLabel('分类', { exact: true })).toHaveValue('ai-creative')
  await expect(page.getByLabel('官网链接')).toHaveValue('https://chatgpt.com/')
  await expect(page.getByLabel('金额 *')).toHaveValue('')
  await expect(page.getByLabel('下一次续费日期 *')).toHaveValue('')
  await expect(page.getByLabel('账号提示')).toHaveValue('')
  await expect(
    page.getByTestId('selected-template-preview').getByTestId('brand-logo'),
  ).toBeVisible()

  await page.getByLabel('金额 *').fill('20.00')
  await page.getByLabel('货币').selectOption('USD')
  await page.getByLabel('下一次续费日期 *').fill('2026-09-30')
  await page.getByRole('button', { name: '保存服务' }).click()
  await expect(page.getByRole('heading', { name: 'ChatGPT' })).toBeVisible()
  await page.getByRole('link', { name: '编辑' }).click()
  await page.getByLabel('金额 *').fill('22.00')
  await page.getByRole('button', { name: '保存服务' }).click()
  await expect(page.getByText('US$22.00')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
})

test('添加、付款、暂停、恢复、编辑和刷新持久化', async ({ page }) => {
  await addService(page)
  await expect(page.getByRole('button', { name: '标记为已取消（保留记录）' })).toBeVisible()
  await expect(page.getByRole('button', { name: /推荐/ })).toHaveCount(0)
  await page.getByRole('button', { name: '标记已支付' }).click()
  await page.getByRole('button', { name: '确认已支付' }).click()
  await expect(page.getByText('2026-09-30 · 09:00')).toBeVisible()
  await expect(page.getByText('已支付', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '暂停服务' }).click()
  await expect(page.getByText('SERVICE / PAUSED')).toBeVisible()
  await page.getByRole('button', { name: '恢复使用' }).click()
  await expect(page.getByText('SERVICE / ACTIVE')).toBeVisible()

  await page.getByRole('link', { name: '编辑' }).click()
  await page.getByLabel('金额 *').fill('22.00')
  await page.getByLabel('下一次续费日期 *').fill('2026-10-31')
  await page.getByRole('button', { name: '保存服务' }).click()
  await expect(page.getByText('US$22.00')).toBeVisible()
  await expect(page.getByText('2026-10-31 · 09:00')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'ChatGPT Plus' })).toBeVisible()
  await expect(page.getByText('2026-10-31 · 09:00')).toBeVisible()
})

test('导出、清空并从 JSON 备份恢复', async ({ page }) => {
  await addService(page, '备份测试服务')
  await page.getByRole('link', { name: '设置' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /导出 JSON 备份/ }).click()
  const download = await downloadPromise
  const backupPath = await download.path()
  expect(backupPath).toBeTruthy()

  await page.getByRole('button', { name: '清空全部数据' }).click()
  await page.getByLabel('输入 DELETE 以继续').fill('DELETE')
  await page.getByRole('button', { name: '确认清空' }).click()
  await expect(page.getByText('全部本地数据已清空。')).toBeVisible()

  await page.locator('input[type=file]').setInputFiles(backupPath!)
  await expect(page.getByText('1 个服务 · 0 条历史')).toBeVisible()
  await page.getByRole('button', { name: '合并数据' }).click()
  await page.getByRole('link', { name: '服务' }).click()
  await expect(page.getByText('备份测试服务')).toBeVisible()
})

test('品牌 Logo 在深色与浅色主题下显示，且 375/390px 无横向滚动', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.getByRole('link', { name: '添加第一个服务' }).click()
  await chooseChatGPT(page)
  await page.getByLabel('金额 *').fill('20.00')
  await page.getByLabel('下一次续费日期 *').fill('2026-09-30')
  await page.getByRole('button', { name: '保存服务' }).click()
  await expect(page.getByRole('heading', { name: 'ChatGPT' })).toBeVisible()
  const serviceUrl = page.url()

  await page.getByRole('link', { name: '设置' }).click()
  await page.getByLabel('主题').selectOption('light')
  await page.getByRole('button', { name: '保存偏好' }).click()
  await expect(page.getByText('设置已保存在本机。')).toBeVisible()
  await page.goto(serviceUrl)
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('light')
  await expect(page.getByTestId('brand-logo')).toBeVisible()

  await page.getByRole('link', { name: '设置' }).click()
  await page.getByLabel('主题').selectOption('dark')
  await page.getByRole('button', { name: '保存偏好' }).click()
  await expect(page.getByText('设置已保存在本机。')).toBeVisible()
  await page.goto(serviceUrl)
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
  await expect(page.getByTestId('brand-logo')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
  await page.setViewportSize({ width: 390, height: 844 })
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
})

test('手机端货币选择显示国旗与名称，并保存三位小数货币', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/services/new')
  const currency = page.getByLabel('货币')
  await expect(currency.locator('option[value="CNY"]')).toContainText('🇨🇳 CNY')
  await expect(currency.locator('option[value="AED"]')).toContainText('🇦🇪 AED')

  await page.getByLabel('名称 *').fill('Bahrain Test')
  await page.getByLabel('分类', { exact: true }).selectOption('other')
  await page.getByLabel('金额 *').fill('12.345')
  await currency.selectOption('BHD')
  await page.getByLabel('下一次续费日期 *').fill('2026-10-01')
  await page.getByRole('button', { name: '保存服务' }).click()
  await expect(page.getByRole('heading', { name: 'Bahrain Test' })).toBeVisible()

  await page.getByRole('link', { name: '编辑' }).click()
  await expect(page.getByLabel('货币')).toHaveValue('BHD')
  await expect(page.getByLabel('金额 *')).toHaveValue('12.345')
  await page.reload()
  await expect(page.getByLabel('货币')).toHaveValue('BHD')
})

test('首页语言入口可即时切换、自动保存并在刷新后保持', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  const homeLanguage = page.locator('.language-switcher select')
  const switcherBox = await page.locator('.language-switcher').boundingBox()

  expect(switcherBox!.height).toBeGreaterThanOrEqual(47.9)
  await expect(homeLanguage).toHaveValue('zh-CN')
  await homeLanguage.selectOption('zh-TW')
  await expect(page.getByRole('heading', { name: /每一筆續費，.*心中有數。/ })).toBeVisible()
  await page.reload()
  await expect(homeLanguage).toHaveValue('zh-TW')
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-TW')

  await page.goto('/settings')
  const language = page.getByLabel('Language')
  await expect(page.getByRole('heading', { name: '設定', exact: true })).toBeVisible()

  await language.selectOption('ja')
  await expect(page.getByRole('heading', { name: '設定', exact: true })).toBeVisible()
  await expect(page.getByText('言語をこの端末に自動保存しました。')).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  await page.reload()
  await expect(language).toHaveValue('ja')

  await language.selectOption('en')
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expect(page.getByText('Language saved automatically on this device.')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expect(language).toHaveValue('en')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await page.goto('/services/new')
  await expect(page.getByRole('heading', { name: 'Add service' })).toBeVisible()
  await expect(page.getByLabel('Category', { exact: true }).locator('option')).toContainText([
    'AI & Creation',
    'Development Tools',
  ])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
})

test('Service Worker 控制后可离线打开 Shell 和本地数据', async ({ page, context }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '添加第一个服务' }).click()
  await chooseChatGPT(page)
  await page.getByLabel('金额 *').fill('20.00')
  await page.getByLabel('下一次续费日期 *').fill('2026-09-30')
  await page.getByRole('button', { name: '保存服务' }).click()
  await expect(page.getByTestId('brand-logo')).toBeVisible()
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await context.setOffline(true)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'ChatGPT' })).toBeVisible()
  await expect(page.getByTestId('brand-logo')).toBeVisible()
  await context.setOffline(false)
})
