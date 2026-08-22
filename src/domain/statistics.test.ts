import { describe, expect, it } from 'vitest'
import type { PaymentRecord, SubscriptionService } from './models'
import { dueWithinDays, overdueServices, paidForMonth, plannedForMonth } from './statistics'

const service = (id: string, date: string, status: SubscriptionService['status'] = 'active'): SubscriptionService => ({
  id, name: id, category: '其他', amountMinor: id === 'usd' ? 2000 : 1000,
  currency: id === 'usd' ? 'USD' : 'CNY', intervalValue: 1, intervalUnit: 'month', nextRenewalDate: date,
  timeZone: 'Asia/Shanghai', reminderDays: [], status, color: '#000', iconType: 'initial',
  recurrenceAnchor: { preferredDayOfMonth: 1, preferredMonth: 1 }, createdAt: '', updatedAt: '',
})

describe('statistics', () => {
  const services = [service('cny', '2026-08-20'), service('usd', '2026-08-25'), service('paused', '2026-08-21', 'paused'), service('late', '2026-08-01')]

  it('separates planned totals by currency and excludes paused', () => {
    expect(plannedForMonth(services, '2026-08')).toEqual({ CNY: 2000, USD: 2000 })
  })

  it('finds due and overdue without auto-hiding overdue entries', () => {
    expect(dueWithinDays(services, '2026-08-20', 7).map((item) => item.id)).toEqual(['cny', 'usd'])
    expect(overdueServices(services, '2026-08-20').map((item) => item.id)).toEqual(['late'])
  })

  it('counts paid history separately from skipped history', () => {
    const records: PaymentRecord[] = [
      { id: '1', serviceId: 'x', dueDate: '2026-08-01', amountMinor: 500, currency: 'CNY', status: 'paid', completedAt: '' },
      { id: '2', serviceId: 'x', dueDate: '2026-08-02', amountMinor: 500, currency: 'CNY', status: 'skipped', completedAt: '' },
    ]
    expect(paidForMonth(records, '2026-08')).toEqual({ CNY: 500 })
  })
})
