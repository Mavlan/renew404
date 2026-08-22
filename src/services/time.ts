export function todayInTimeZone(timeZone = 'Asia/Shanghai', now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function formatChineseDate(value: string): string {
  return formatLocalizedDate(value)
}
import { formatLocalizedDate } from '../i18n'
