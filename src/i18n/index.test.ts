import { afterEach, describe, expect, it } from 'vitest'
import { createCustomCategory, createSystemCategories } from '../data/categories'
import { SERVICE_TEMPLATES, searchServiceTemplates, templateServiceDefaults } from '../data/serviceTemplates'
import { settingsSchema } from '../domain/validation'
import {
  formatLocalizedDate,
  detectSystemLocale,
  hasTranslation,
  localizedCategoryName,
  setLocale,
  t,
} from './index'

afterEach(() => setLocale('zh-CN'))

describe('i18n', () => {
  it.each([
    [['zh-CN'], 'zh-CN'],
    [['zh-Hans-SG'], 'zh-CN'],
    [['zh-TW'], 'zh-TW'],
    [['zh-Hant-HK'], 'zh-TW'],
    [['ja-JP'], 'ja'],
    [['en-US'], 'en'],
    [['fr-FR'], 'zh-CN'],
  ] as const)('detects supported locale from %j', (languages, expected) => {
    expect(detectSystemLocale(languages)).toBe(expected)
  })

  it('has all four translations for every static UI key used by the app', () => {
    const sources = import.meta.glob('../**/*.{ts,vue}', {
      eager: true,
      query: '?raw',
      import: 'default',
    }) as Record<string, string>
    const keys = new Set<string>()
    for (const [file, source] of Object.entries(sources)) {
      if (/\.(test|spec)\.ts$/.test(file) || file.endsWith('/i18n/index.ts')) continue
      for (const match of source.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) keys.add(match[1])
    }
    for (const key of keys) {
      for (const locale of ['zh-CN', 'zh-TW', 'en', 'ja'] as const) {
        expect(hasTranslation(key, locale), `${locale} is missing: ${key}`).toBe(true)
      }
    }
  })

  it.each([
    ['zh-CN', '设置', 'AI 与创作'],
    ['zh-TW', '設定', 'AI 與創作'],
    ['en', 'Settings', 'AI & Creation'],
    ['ja', '設定', 'AI・クリエイティブ'],
  ] as const)('switches the interface and system category for %s', (locale, settings, categoryName) => {
    const category = createSystemCategories().find((item) => item.id === 'ai-creative')!
    setLocale(locale)
    expect(t('设置')).toBe(settings)
    expect(localizedCategoryName(category)).toBe(categoryName)
    expect(document.documentElement.lang).toBe(locale)
  })

  it('keeps user-created category names unchanged in every language', () => {
    const custom = createCustomCategory('我的托管服务')
    for (const locale of ['zh-CN', 'zh-TW', 'en', 'ja'] as const) {
      setLocale(locale)
      expect(localizedCategoryName(custom)).toBe('我的托管服务')
    }
  })

  it('localizes generic template names and makes them searchable', () => {
    const template = SERVICE_TEMPLATES.find((item) => item.id === 'generic-domain')!
    setLocale('en')
    expect(templateServiceDefaults(template).name).toBe('Generic Domain Renewal')
    expect(searchServiceTemplates('Generic Domain Renewal').map((item) => item.id)).toContain('generic-domain')
    setLocale('ja')
    expect(templateServiceDefaults(template).name).toBe('汎用ドメイン更新')
  })

  it('formats dates using the selected language', () => {
    setLocale('en')
    expect(formatLocalizedDate('2026-08-22')).toContain('August')
    setLocale('ja')
    expect(formatLocalizedDate('2026-08-22')).toContain('8月')
  })

  it('describes local cancellation without recommending subscription cancellation', () => {
    const expected = {
      'zh-CN': '标记为已取消（保留记录）',
      'zh-TW': '標記為已取消（保留記錄）',
      en: 'Mark as cancelled (keep records)',
      ja: '解約済みにする（記録を保持）',
    } as const
    for (const [locale, label] of Object.entries(expected)) {
      setLocale(locale as keyof typeof expected)
      expect(t('标记为已取消（保留记录）')).toBe(label)
      expect(label).not.toMatch(/推荐|建議|recommended|推奨/)
    }
  })

  it('defaults legacy settings without locale to Simplified Chinese', () => {
    const parsed = settingsSchema.parse({
      id: 'settings',
      theme: 'system',
      defaultCurrency: 'CNY',
      defaultTimeZone: 'Asia/Shanghai',
      defaultReminderDays: [7, 3, 1, 0],
      weekStartsOn: 1,
      backupReminderDays: 30,
      onboardingComplete: true,
      createdAt: '2026-08-01T00:00:00.000Z',
      updatedAt: '2026-08-01T00:00:00.000Z',
    })
    expect(parsed.locale).toBe('zh-CN')
  })
})
