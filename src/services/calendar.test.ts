import { describe, expect, it } from 'vitest'
import type { SubscriptionService } from '../domain/models'
import { generateCalendar } from './calendar'

const service: SubscriptionService = {
  id: 'chatgpt', name: 'ChatGPT Plus', category: 'AI 工具', amountMinor: 2000, currency: 'USD',
  intervalValue: 1, intervalUnit: 'month', nextRenewalDate: '2025-01-31', renewalTime: '09:00',
  timeZone: 'Asia/Shanghai', reminderDays: [7, 1, 0], status: 'active', color: '#ff5a00', iconType: 'initial',
  recurrenceAnchor: { preferredDayOfMonth: 31, preferredMonth: 1 }, createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z',
}

describe('calendar export', () => {
  const ics = generateCalendar([service], new Date('2025-01-01T00:00:00.000Z'))
  it('creates 24 explicit events', () => expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(24))
  it('uses stable UIDs and month-end anchor recovery', () => {
    expect(ics).toContain('UID:chatgpt-20250228@renew404.try404.com')
    expect(ics).toContain('UID:chatgpt-20250331@renew404.try404.com')
  })
  it('includes selected alarms including same-day', () => {
    expect(ics).toContain('TRIGGER:-P7D')
    expect(ics).toContain('TRIGGER:-PT0M')
  })
  it('excludes paused services', () => expect(generateCalendar([{ ...service, status: 'paused' }])).not.toContain('BEGIN:VEVENT'))
})
