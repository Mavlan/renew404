import { CURRENCY_CODES, type CurrencyCodeValue } from '../data/currencies'

export const CURRENCIES = CURRENCY_CODES
export type CurrencyCode = CurrencyCodeValue
export type BillingUnit = 'day' | 'week' | 'month' | 'year'
export type ServiceStatus = 'active' | 'paused' | 'cancelled'
export type PaymentStatus = 'paid' | 'skipped'
export type AppLocale = 'zh-CN' | 'zh-TW' | 'en' | 'ja'
export type CategoryIconKey =
  | 'sparkles' | 'code-2' | 'cloud-cog' | 'globe-2' | 'briefcase-business'
  | 'hard-drive-download' | 'clapperboard' | 'headphones' | 'gamepad-2'
  | 'users-round' | 'network' | 'radio-tower' | 'shopping-bag' | 'landmark'
  | 'graduation-cap' | 'plane' | 'shapes'

export interface ServiceCategory {
  id: string
  name: string
  iconKey: CategoryIconKey
  color: string
  sortOrder: number
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface RecurrenceAnchor {
  preferredDayOfMonth?: number
  preferredMonth?: number
}

export interface SubscriptionService {
  id: string
  name: string
  category: string
  categoryId?: string
  amountMinor: number
  currency: CurrencyCode
  customCurrencyLabel?: string
  intervalValue: number
  intervalUnit: BillingUnit
  nextRenewalDate: string
  renewalTime?: string
  timeZone: string
  reminderDays: number[]
  status: ServiceStatus
  color: string
  iconType: 'initial' | 'emoji'
  iconValue?: string
  iconKey?: string
  websiteUrl?: string
  accountHint?: string
  note?: string
  recurrenceAnchor: RecurrenceAnchor
  createdAt: string
  updatedAt: string
}

export interface PaymentRecord {
  id: string
  serviceId: string
  dueDate: string
  dueTime?: string
  amountMinor: number
  currency: CurrencyCode
  status: PaymentStatus
  completedAt: string
  note?: string
}

export interface AppSettings {
  id: 'settings'
  locale: AppLocale
  theme: 'system' | 'light' | 'dark'
  defaultCurrency: CurrencyCode
  defaultTimeZone: string
  defaultReminderDays: number[]
  weekStartsOn: 0 | 1
  backupReminderDays: number
  lastBackupAt?: string
  onboardingComplete: boolean
  createdAt: string
  updatedAt: string
}

export function createDefaultSettings(now = new Date().toISOString()): AppSettings {
  return {
    id: 'settings',
    locale: 'zh-CN',
    theme: 'system',
    defaultCurrency: 'CNY',
    defaultTimeZone: 'Asia/Shanghai',
    defaultReminderDays: [7, 3, 1, 0],
    weekStartsOn: 1,
    backupReminderDays: 30,
    onboardingComplete: false,
    createdAt: now,
    updatedAt: now,
  }
}
