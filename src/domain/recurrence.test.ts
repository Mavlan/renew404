import { describe, expect, it } from 'vitest'
import { advanceRenewalDate, createRecurrenceAnchor } from './recurrence'

describe('advanceRenewalDate', () => {
  it.each([
    ['2026-01-01', 'month', 1, '2026-02-01'],
    ['2026-01-28', 'month', 1, '2026-02-28'],
    ['2025-01-29', 'month', 1, '2025-02-28'],
    ['2025-01-30', 'month', 1, '2025-02-28'],
    ['2025-01-31', 'month', 1, '2025-02-28'],
    ['2026-03-01', 'week', 2, '2026-03-15'],
    ['2026-01-31', 'month', 3, '2026-04-30'],
    ['2024-02-29', 'year', 2, '2026-02-28'],
  ] as const)('%s + %s %s = %s', (start, unit, value, expected) => {
    expect(advanceRenewalDate(start, value, unit, createRecurrenceAnchor(start))).toBe(expected)
  })

  it('restores January 31 anchor after February', () => {
    const anchor = createRecurrenceAnchor('2025-01-31')
    const february = advanceRenewalDate('2025-01-31', 1, 'month', anchor)
    expect(february).toBe('2025-02-28')
    expect(advanceRenewalDate(february, 1, 'month', anchor)).toBe('2025-03-31')
  })

  it('restores leap day when leap year returns', () => {
    const anchor = createRecurrenceAnchor('2024-02-29')
    const next = advanceRenewalDate('2024-02-29', 1, 'year', anchor)
    expect(next).toBe('2025-02-28')
    expect(advanceRenewalDate(next, 3, 'year', anchor)).toBe('2028-02-29')
  })
})
