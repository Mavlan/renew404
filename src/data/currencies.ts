/**
 * ISO 4217 currencies that can reasonably be used for consumer subscription payments.
 * Funds, precious metals and accounting-only units are intentionally excluded.
 */
export const CURRENCY_CODES = [
  'AED', 'AFN', 'ALL', 'AMD', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD',
  'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 'CZK',
  'DJF', 'DKK', 'DOP', 'DZD',
  'EGP', 'ERN', 'ETB', 'EUR',
  'FJD', 'FKP',
  'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD',
  'HKD', 'HNL', 'HTG', 'HUF',
  'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK',
  'JMD', 'JOD', 'JPY',
  'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT',
  'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD',
  'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN',
  'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD',
  'OMR',
  'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG',
  'QAR',
  'RON', 'RSD', 'RUB', 'RWF',
  'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL',
  'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS',
  'UAH', 'UGX', 'USD', 'UYU', 'UZS',
  'VED', 'VES', 'VND', 'VUV',
  'WST',
  'XAF', 'XCD', 'XCG', 'XOF', 'XPF',
  'YER',
  'ZAR', 'ZMW', 'ZWG',
  'OTHER',
] as const

export type CurrencyCodeValue = (typeof CURRENCY_CODES)[number]

export const COMMON_CURRENCY_CODES = [
  'CNY', 'USD', 'EUR', 'GBP', 'JPY', 'HKD', 'TWD', 'KRW', 'SGD', 'AUD', 'CAD', 'CHF',
] as const satisfies readonly CurrencyCodeValue[]

const ZERO_DECIMAL_CURRENCIES = new Set<CurrencyCodeValue>([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF', 'UGX', 'VND', 'VUV',
  'XAF', 'XOF', 'XPF',
])

const THREE_DECIMAL_CURRENCIES = new Set<CurrencyCodeValue>([
  'BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND',
])

const REGIONAL_FLAGS: Partial<Record<CurrencyCodeValue, string>> = {
  EUR: '🇪🇺',
  TWD: '',
  XAF: '🌍',
  XCD: '🌎',
  XCG: '🏝️',
  XOF: '🌍',
  XPF: '🌏',
  OTHER: '🌐',
}

export function currencyMinorUnits(currency: CurrencyCodeValue): number {
  if (ZERO_DECIMAL_CURRENCIES.has(currency)) return 0
  if (THREE_DECIMAL_CURRENCIES.has(currency)) return 3
  return 2
}

export function currencyFlag(currency: CurrencyCodeValue): string {
  if (currency in REGIONAL_FLAGS) return REGIONAL_FLAGS[currency] || ''
  const countryCode = currency.slice(0, 2)
  return [...countryCode]
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('')
}

export function currencyDisplayName(currency: CurrencyCodeValue, locale: string): string {
  if (currency === 'OTHER') {
    return ({ 'zh-CN': '其他 / 自定义', 'zh-TW': '其他 / 自訂', ja: 'その他 / カスタム' } as Record<string, string>)[locale]
      || 'Other / Custom'
  }
  try {
    return new Intl.DisplayNames([locale], { type: 'currency' }).of(currency) || currency
  } catch {
    return currency
  }
}

export function currencyOptionLabel(currency: CurrencyCodeValue, locale: string): string {
  const flag = currencyFlag(currency)
  return `${flag ? `${flag} ` : ''}${currency} · ${currencyDisplayName(currency, locale)}`
}
