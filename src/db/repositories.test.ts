import { reactive } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { createRecurrenceAnchor } from '../domain/recurrence'
import type { SubscriptionService } from '../domain/models'
import { Renew404Database } from './database'
import { Renew404Repository } from './repositories'

const database = new Renew404Database('renew404-repository-test')
const repository = new Renew404Repository(database)
afterEach(async () => { await database.delete() })

describe('Renew404Repository', () => {
  it('removes Vue proxies before writing to IndexedDB', async () => {
    const state = reactive({ reminders: [7, 1, 0] })
    const service: SubscriptionService = {
      id: 'proxy-service', name: 'Proxy Test', category: '其他', amountMinor: 100, currency: 'CNY',
      intervalValue: 1, intervalUnit: 'month', nextRenewalDate: '2026-08-31', renewalTime: '09:00',
      timeZone: 'Asia/Shanghai', reminderDays: state.reminders, status: 'active', color: '#ff5a00',
      iconType: 'initial', recurrenceAnchor: createRecurrenceAnchor('2026-08-31'),
      createdAt: '2026-08-01T00:00:00.000Z', updatedAt: '2026-08-01T00:00:00.000Z',
    }
    await repository.saveService(service)
    expect(await repository.getService(service.id)).toMatchObject({ id: service.id, reminderDays: [7, 1, 0] })
  })
})
