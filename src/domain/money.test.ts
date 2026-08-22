import { describe, expect, it } from 'vitest'
import { parseAmountToMinor, sumByCurrency } from './money'

describe('money', () => {
  it('converts decimal amounts to minor units without floats', () => {
    expect(parseAmountToMinor('145.00', 'CNY')).toBe(14500)
    expect(parseAmountToMinor('2.99', 'USD')).toBe(299)
    expect(parseAmountToMinor('1200', 'JPY')).toBe(1200)
  })

  it('rejects JPY decimals', () => {
    expect(() => parseAmountToMinor('12.5', 'JPY')).toThrow()
  })

  it('supports ISO zero and three-decimal currencies', () => {
    expect(parseAmountToMinor('12.345', 'BHD')).toBe(12345)
    expect(parseAmountToMinor('1200', 'KRW')).toBe(1200)
    expect(() => parseAmountToMinor('12.3456', 'BHD')).toThrow()
    expect(() => parseAmountToMinor('12.5', 'KRW')).toThrow()
  })

  it('keeps currencies separate', () => {
    expect(sumByCurrency([
      { amountMinor: 100, currency: 'CNY' as const },
      { amountMinor: 250, currency: 'CNY' as const },
      { amountMinor: 99, currency: 'USD' as const },
    ])).toEqual({ CNY: 350, USD: 99 })
  })
})
