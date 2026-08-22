import { describe, expect, it } from 'vitest'
import {
  COMMON_CURRENCY_CODES,
  CURRENCY_CODES,
  currencyDisplayName,
  currencyFlag,
  currencyMinorUnits,
  currencyOptionLabel,
} from './currencies'

describe('currencies', () => {
  it('provides a unique worldwide payment-currency list while preserving legacy values', () => {
    expect(CURRENCY_CODES.length).toBeGreaterThan(145)
    expect(new Set(CURRENCY_CODES).size).toBe(CURRENCY_CODES.length)
    expect(CURRENCY_CODES).toEqual(expect.arrayContaining(['CNY', 'USD', 'GBP', 'EUR', 'HKD', 'JPY', 'OTHER']))
    expect(COMMON_CURRENCY_CODES).toEqual(expect.arrayContaining(['CNY', 'USD', 'EUR', 'JPY']))
  })

  it('uses ISO minor units for zero, two and three-decimal currencies', () => {
    expect(currencyMinorUnits('JPY')).toBe(0)
    expect(currencyMinorUnits('USD')).toBe(2)
    expect(currencyMinorUnits('BHD')).toBe(3)
  })

  it('shows a country or regional flag and a localized currency name', () => {
    expect(currencyFlag('CNY')).toBe('🇨🇳')
    expect(currencyFlag('EUR')).toBe('🇪🇺')
    expect(currencyFlag('TWD')).toBe('')
    expect(currencyFlag('XOF')).toBe('🌍')
    expect(currencyDisplayName('USD', 'en')).not.toBe('USD')
    expect(currencyOptionLabel('JPY', 'ja')).toMatch(/^🇯🇵 JPY · /)
    expect(currencyOptionLabel('TWD', 'zh-CN')).toMatch(/^TWD · /)
  })
})
