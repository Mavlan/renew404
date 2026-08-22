import { z } from 'zod'
import { CURRENCIES } from './models'

const currency = z.enum(CURRENCIES)
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const isoString = z.string().datetime({ offset: true })

export const serviceSchema = z.object({
  id: z.string().min(1), name: z.string().min(1), category: z.string(), amountMinor: z.number().int().nonnegative(),
  categoryId: z.string().min(1).optional(), iconKey: z.string().min(1).optional(),
  currency, customCurrencyLabel: z.string().optional(), intervalValue: z.number().int().min(1).max(999),
  intervalUnit: z.enum(['day', 'week', 'month', 'year']), nextRenewalDate: dateString,
  renewalTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(), timeZone: z.string().min(1),
  reminderDays: z.array(z.number().int().min(0).max(365)), status: z.enum(['active', 'paused', 'cancelled']),
  color: z.string().min(1), iconType: z.enum(['initial', 'emoji']), iconValue: z.string().optional(),
  websiteUrl: z.string().url().optional(), accountHint: z.string().optional(), note: z.string().optional(),
  recurrenceAnchor: z.object({ preferredDayOfMonth: z.number().int().min(1).max(31).optional(), preferredMonth: z.number().int().min(1).max(12).optional() }),
  createdAt: isoString, updatedAt: isoString,
})

export const categorySchema = z.object({
  id: z.string().min(1), name: z.string().min(1),
  iconKey: z.enum(['sparkles', 'code-2', 'cloud-cog', 'globe-2', 'briefcase-business', 'hard-drive-download', 'clapperboard', 'headphones', 'gamepad-2', 'users-round', 'network', 'radio-tower', 'shopping-bag', 'landmark', 'graduation-cap', 'plane', 'shapes']),
  color: z.string().min(1), sortOrder: z.number().int(), isSystem: z.boolean(), createdAt: isoString, updatedAt: isoString,
})

export const paymentSchema = z.object({
  id: z.string().min(1), serviceId: z.string().min(1), dueDate: dateString,
  dueTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(), amountMinor: z.number().int().nonnegative(),
  currency, status: z.enum(['paid', 'skipped']), completedAt: isoString, note: z.string().optional(),
})

export const settingsSchema = z.object({
  id: z.literal('settings'), locale: z.enum(['zh-CN', 'zh-TW', 'en', 'ja']).default('zh-CN'),
  theme: z.enum(['system', 'light', 'dark']), defaultCurrency: currency,
  defaultTimeZone: z.string().min(1), defaultReminderDays: z.array(z.number().int().min(0).max(365)),
  weekStartsOn: z.union([z.literal(0), z.literal(1)]), backupReminderDays: z.number().int().min(1).max(3650),
  lastBackupAt: isoString.optional(), onboardingComplete: z.boolean().default(false), createdAt: isoString, updatedAt: isoString,
})

export const backupSchema = z.object({
  format: z.literal('renew404-backup'), version: z.literal(1), exportedAt: isoString,
  appVersion: z.string(), data: z.object({ services: z.array(serviceSchema), payments: z.array(paymentSchema), settings: settingsSchema, categories: z.array(categorySchema).optional() }),
})
