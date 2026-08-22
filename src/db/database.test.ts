import Dexie, { type Table } from 'dexie'
import { describe, expect, it } from 'vitest'
import type { SubscriptionService } from '../domain/models'
import { Renew404Database } from './database'
import { Renew404Repository } from './repositories'
import { detectSystemLocale } from '../i18n'

type LegacyService = Omit<SubscriptionService, 'categoryId' | 'iconKey'>

class LegacyRenew404Database extends Dexie {
  services!: Table<LegacyService, string>

  constructor(name: string) {
    super(name)
    this.version(1).stores({
      services: 'id, name, category, status, nextRenewalDate, updatedAt',
      payments: 'id, serviceId, dueDate, status, completedAt',
      settings: 'id',
    })
  }
}

function legacyService(id: string, category: string): LegacyService {
  return {
    id,
    name: `旧服务 ${id}`,
    category,
    amountMinor: 1980,
    currency: 'CNY',
    intervalValue: 1,
    intervalUnit: 'month',
    nextRenewalDate: '2026-09-10',
    renewalTime: '09:00',
    timeZone: 'Asia/Shanghai',
    reminderDays: [7, 1, 0],
    status: 'active',
    color: '#ed4f00',
    iconType: 'initial',
    iconValue: '旧',
    accountHint: 'a***@example.com',
    note: '必须保留',
    recurrenceAnchor: { preferredDayOfMonth: 10, preferredMonth: 9 },
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-02T00:00:00.000Z',
  }
}

describe('Dexie v1 → v2 migration', () => {
  it('preserves old records and maps 其他 while retaining unknown categories as custom categories', async () => {
    const name = `renew404-migration-${crypto.randomUUID()}`
    const legacy = new LegacyRenew404Database(name)
    await legacy.services.bulkAdd([
      legacyService('other', '其他'),
      legacyService('custom', '旧版私有分类'),
    ])
    await legacy.table('payments').add({
      id: 'payment-1', serviceId: 'other', dueDate: '2026-08-10', amountMinor: 1980,
      currency: 'CNY', status: 'paid', completedAt: '2026-08-10T01:00:00.000Z',
    })
    await legacy.table('settings').add({
      id: 'settings', theme: 'dark', defaultCurrency: 'USD', defaultTimeZone: 'Asia/Shanghai',
      defaultReminderDays: [3, 1], weekStartsOn: 1, backupReminderDays: 30,
      onboardingComplete: true, createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-02T00:00:00.000Z',
    })
    legacy.close()

    const upgraded = new Renew404Database(name)
    try {
      const other = await upgraded.services.get('other')
      const custom = await upgraded.services.get('custom')
      expect(other).toMatchObject({
        category: '其他',
        categoryId: 'other',
        amountMinor: 1980,
        note: '必须保留',
      })
      expect(custom).toMatchObject({
        category: '旧版私有分类',
        amountMinor: 1980,
        accountHint: 'a***@example.com',
      })
      expect(custom?.categoryId).toMatch(/^custom-/)
      expect(await upgraded.categories.get(custom!.categoryId!)).toMatchObject({
        name: '旧版私有分类',
        isSystem: false,
      })
      expect(await upgraded.categories.get('other')).toMatchObject({ name: '其他', isSystem: true })
      expect(await upgraded.categories.count()).toBe(18)
      expect(await upgraded.payments.get('payment-1')).toMatchObject({ serviceId: 'other', amountMinor: 1980 })
      expect(await upgraded.settings.get('settings')).toMatchObject({ theme: 'dark', defaultCurrency: 'USD' })
      const repository = new Renew404Repository(upgraded)
      expect(await repository.getSettings()).toMatchObject({
        theme: 'dark',
        defaultCurrency: 'USD',
        locale: detectSystemLocale(),
      })
      expect(await upgraded.settings.get('settings')).toMatchObject({ locale: detectSystemLocale() })
    } finally {
      await upgraded.delete()
    }
  })
})
