import { describe, expect, it } from 'vitest'
import type { SubscriptionService } from './models'
import { processRenewal } from './payments'

const service: SubscriptionService = {
  id: 'service-1', name: '测试服务', category: '其他', amountMinor: 990,
  currency: 'CNY', intervalValue: 1, intervalUnit: 'month', nextRenewalDate: '2026-01-31',
  renewalTime: '09:00', timeZone: 'Asia/Shanghai', reminderDays: [1, 0], status: 'active',
  color: '#ff5a00', iconType: 'initial', recurrenceAnchor: { preferredDayOfMonth: 31, preferredMonth: 1 },
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('processRenewal', () => {
  it.each(['paid', 'skipped'] as const)('creates a %s record and advances the service', (status) => {
    const result = processRenewal(service, status, '2026-01-20T00:00:00.000Z', 'payment-1')
    expect(result.payment).toMatchObject({ status, dueDate: '2026-01-31', amountMinor: 990 })
    expect(result.service.nextRenewalDate).toBe('2026-02-28')
    expect(service.nextRenewalDate).toBe('2026-01-31')
  })
})
