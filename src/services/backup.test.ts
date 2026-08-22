import { describe, expect, it } from 'vitest'
import { createDefaultSettings, type SubscriptionService } from '../domain/models'
import { Renew404Database } from '../db/database'
import { createCustomCategory } from '../data/categories'
import { createBackup, importBackup, mergeBackupData, parseBackup, type Renew404Backup } from './backup'
import { detectSystemLocale } from '../i18n'

const makeService = (updatedAt: string): SubscriptionService => ({
  id: 'service-1',
  name: '云服务',
  category: '云服务',
  amountMinor: 1200,
  currency: 'CNY',
  intervalValue: 1,
  intervalUnit: 'month',
  nextRenewalDate: '2026-09-30',
  renewalTime: '09:00',
  timeZone: 'Asia/Shanghai',
  reminderDays: [1, 0],
  status: 'active',
  color: '#ff5a00',
  iconType: 'initial',
  recurrenceAnchor: { preferredDayOfMonth: 30, preferredMonth: 9 },
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt,
})

const backup = (): Renew404Backup => ({
  format: 'renew404-backup',
  version: 1,
  exportedAt: '2026-08-22T00:00:00.000Z',
  appVersion: '0.1.0',
  data: {
    services: [makeService('2026-08-20T00:00:00.000Z')],
    payments: [],
    settings: createDefaultSettings('2026-08-01T00:00:00.000Z'),
    categories: [],
  },
})

describe('backup validation', () => {
  it('accepts a complete version 1 backup', () =>
    expect(parseBackup(JSON.stringify(backup())).data.services).toHaveLength(1))
  it('accepts worldwide ISO currency codes without changing the backup format', () => {
    const raw = backup()
    raw.data.services[0].currency = 'BHD'
    raw.data.services[0].amountMinor = 12345
    raw.data.settings.defaultCurrency = 'AED'
    expect(parseBackup(raw).data).toMatchObject({
      services: [{ currency: 'BHD', amountMinor: 12345 }],
      settings: { defaultCurrency: 'AED' },
    })
  })
  it('imports a legacy JSON backup without categories, categoryId, or iconKey', async () => {
    const raw = JSON.parse(JSON.stringify(backup()))
    delete raw.data.categories
    delete raw.data.settings.locale
    raw.data.services[0].category = '其他'
    delete raw.data.services[0].categoryId
    delete raw.data.services[0].iconKey
    const parsed = parseBackup(raw)
    const database = new Renew404Database(`renew404-old-backup-${crypto.randomUUID()}`)
    try {
      await importBackup(parsed, 'replace', database)
      expect(await database.services.get('service-1')).toMatchObject({
        category: '其他',
        categoryId: 'other',
        amountMinor: 1200,
      })
      expect(await database.categories.get('other')).toMatchObject({ name: '其他', isSystem: true })
      expect(await database.settings.get('settings')).toMatchObject({ locale: detectSystemLocale() })
    } finally {
      await database.delete()
    }
  })
  it('exports iconKey and custom category data without embedding logo content', async () => {
    const database = new Renew404Database(`renew404-new-backup-${crypto.randomUUID()}`)
    const category = createCustomCategory('自建工具', '2026-08-22T00:00:00.000Z')
    try {
      await database.categories.add(category)
      await database.services.add({
        ...makeService('2026-08-22T00:00:00.000Z'), category: category.name,
        categoryId: category.id, iconKey: 'chatgpt',
      })
      const exported = await createBackup(database, '2026-08-22T01:00:00.000Z')
      expect(exported.data.services[0]).toMatchObject({ categoryId: category.id, iconKey: 'chatgpt' })
      expect(exported.data.categories).toContainEqual(category)
      expect(exported.data.settings.locale).toBe('zh-CN')
      expect(JSON.stringify(exported)).not.toContain('data:image')
    } finally {
      await database.delete()
    }
  })
  it('rejects malformed JSON', () => expect(() => parseBackup('{bad')).toThrow('有效的 JSON'))
  it('rejects missing fields', () =>
    expect(() => parseBackup({ format: 'renew404-backup', version: 1 })).toThrow('备份格式无效'))
  it('rejects a future version', () =>
    expect(() => parseBackup({ ...backup(), version: 2 })).toThrow('备份格式无效'))
  it('merges duplicate IDs by newest updatedAt', () => {
    const current = backup().data
    const incoming = {
      ...backup().data,
      services: [{ ...makeService('2026-08-21T00:00:00.000Z'), name: '较新名称' }],
    }
    expect(mergeBackupData(current, incoming).services[0]?.name).toBe('较新名称')
  })
})
