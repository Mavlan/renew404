import type { BillingUnit, RecurrenceAnchor, SubscriptionService } from './models'
import { t } from '../i18n'

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export interface DateParts {
  year: number
  month: number
  day: number
}

export function parseLocalDate(value: string): DateParts {
  const match = DATE_PATTERN.exec(value)
  if (!match) throw new Error(t('error.invalidDate', { value }))
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) }
  const maxDay = daysInMonth(parts.year, parts.month)
  if (parts.month < 1 || parts.month > 12 || parts.day < 1 || parts.day > maxDay) {
    throw new Error(t('error.invalidDate', { value }))
  }
  return parts
}

export function formatLocalDate(parts: DateParts): string {
  return `${parts.year.toString().padStart(4, '0')}-${parts.month.toString().padStart(2, '0')}-${parts.day.toString().padStart(2, '0')}`
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export function createRecurrenceAnchor(date: string): RecurrenceAnchor {
  const { month, day } = parseLocalDate(date)
  return { preferredDayOfMonth: day, preferredMonth: month }
}

export function advanceRenewalDate(
  currentDate: string,
  intervalValue: number,
  intervalUnit: BillingUnit,
  anchor: RecurrenceAnchor = createRecurrenceAnchor(currentDate),
): string {
  if (!Number.isInteger(intervalValue) || intervalValue < 1 || intervalValue > 999) {
    throw new Error(t('error.invalidInterval'))
  }
  const current = parseLocalDate(currentDate)

  if (intervalUnit === 'day' || intervalUnit === 'week') {
    const utc = new Date(Date.UTC(current.year, current.month - 1, current.day))
    utc.setUTCDate(utc.getUTCDate() + intervalValue * (intervalUnit === 'week' ? 7 : 1))
    return formatLocalDate({
      year: utc.getUTCFullYear(),
      month: utc.getUTCMonth() + 1,
      day: utc.getUTCDate(),
    })
  }

  const preferredDay = anchor.preferredDayOfMonth ?? current.day
  if (intervalUnit === 'month') {
    const absoluteMonth = current.year * 12 + (current.month - 1) + intervalValue
    const year = Math.floor(absoluteMonth / 12)
    const month = (absoluteMonth % 12) + 1
    return formatLocalDate({ year, month, day: Math.min(preferredDay, daysInMonth(year, month)) })
  }

  const year = current.year + intervalValue
  const month = anchor.preferredMonth ?? current.month
  return formatLocalDate({ year, month, day: Math.min(preferredDay, daysInMonth(year, month)) })
}

export function getNextRenewalDate(service: SubscriptionService): string {
  return advanceRenewalDate(
    service.nextRenewalDate,
    service.intervalValue,
    service.intervalUnit,
    service.recurrenceAnchor,
  )
}

export function compareLocalDates(a: string, b: string): number {
  return a.localeCompare(b)
}

export function differenceInCalendarDaysLocal(target: string, today: string): number {
  const a = parseLocalDate(target)
  const b = parseLocalDate(today)
  const targetUtc = Date.UTC(a.year, a.month - 1, a.day)
  const todayUtc = Date.UTC(b.year, b.month - 1, b.day)
  return Math.round((targetUtc - todayUtc) / 86_400_000)
}

export function recurrenceLabel(value: number, unit: BillingUnit): string {
  return t('recurrence.label', { value, unit: t(`unit.${unit}`) })
}
