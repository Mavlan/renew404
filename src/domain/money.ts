import type { CurrencyCode } from './models'
import { getLocale, t } from '../i18n'
import { currencyMinorUnits } from '../data/currencies'

export function currencyFractionDigits(currency: CurrencyCode): number {
  return currencyMinorUnits(currency)
}

export function parseAmountToMinor(value: string, currency: CurrencyCode): number {
  const normalized = value.trim()
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) throw new Error(t('请输入有效金额'))
  const digits = currencyFractionDigits(currency)
  const [whole, fraction = ''] = normalized.split('.')
  if (fraction.length > digits) throw new Error(t('money.maxDecimals', { currency, digits }))
  const factor = 10 ** digits
  const amount = Number(whole) * factor + Number(fraction.padEnd(digits, '0') || 0)
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error(t('金额超出可保存范围'))
  return amount
}

export function minorToInput(minor: number, currency: CurrencyCode): string {
  const digits = currencyFractionDigits(currency)
  return (minor / 10 ** digits).toFixed(digits)
}

export function formatCurrency(minor: number, currency: CurrencyCode, customLabel?: string): string {
  if (currency === 'OTHER') return `${customLabel || '¤'} ${minorToInput(minor, currency)}`
  return new Intl.NumberFormat(getLocale(), {
    style: 'currency',
    currency,
    minimumFractionDigits: currencyFractionDigits(currency),
    maximumFractionDigits: currencyFractionDigits(currency),
  }).format(minor / 10 ** currencyFractionDigits(currency))
}

export function sumByCurrency<T extends { amountMinor: number; currency: CurrencyCode }>(items: T[]) {
  return items.reduce<Partial<Record<CurrencyCode, number>>>((totals, item) => {
    totals[item.currency] = (totals[item.currency] ?? 0) + item.amountMinor
    return totals
  }, {})
}
