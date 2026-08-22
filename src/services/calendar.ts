import type { SubscriptionService } from '../domain/models'
import { formatCurrency } from '../domain/money'
import { advanceRenewalDate, recurrenceLabel } from '../domain/recurrence'
import { getLocale, t } from '../i18n'

const escapeIcs = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
const compactDate = (value: string) => value.replaceAll('-', '')
const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

export function generateCalendar(services: SubscriptionService[], generatedAt = new Date()): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//Try404//Renew404 0.1//${getLocale().toUpperCase()}`, 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Renew404']
  for (const service of services.filter((item) => item.status === 'active')) {
    let date = service.nextRenewalDate
    for (let index = 0; index < 24; index += 1) {
      const time = (service.renewalTime || '09:00').replace(':', '') + '00'
      const amount = formatCurrency(service.amountMinor, service.currency, service.customCurrencyLabel)
      const description = [
        t('calendar.service', { name: service.name }), t('calendar.amount', { amount }),
        t('calendar.interval', { interval: recurrenceLabel(service.intervalValue, service.intervalUnit) }),
        service.websiteUrl ? t('calendar.website', { url: service.websiteUrl }) : '',
        service.note ? t('calendar.notes', { notes: service.note }) : '', t('calendar.generated'),
      ].filter(Boolean).join('\n')
      lines.push('BEGIN:VEVENT', `UID:${service.id}-${compactDate(date)}@renew404.try404.com`, `DTSTAMP:${stamp(generatedAt)}`, `DTSTART;TZID=${service.timeZone}:${compactDate(date)}T${time}`, `SUMMARY:${escapeIcs(t('calendar.summary', { name: service.name, amount }))}`, `DESCRIPTION:${escapeIcs(description)}`)
      for (const day of [...new Set(service.reminderDays)].sort((a, b) => b - a)) {
        lines.push('BEGIN:VALARM', `TRIGGER:${day === 0 ? '-PT0M' : `-P${day}D`}`, 'ACTION:DISPLAY', `DESCRIPTION:${escapeIcs(t('calendar.reminder', { name: service.name }))}`, 'END:VALARM')
      }
      lines.push('END:VEVENT')
      date = advanceRenewalDate(date, service.intervalValue, service.intervalUnit, service.recurrenceAnchor)
    }
  }
  lines.push('END:VCALENDAR')
  return `${lines.join('\r\n')}\r\n`
}

export function calendarFilename(service?: SubscriptionService) {
  const safe = service?.name.replace(/[\\/:*?"<>|]/g, '-').slice(0, 50)
  return safe ? `renew404-${safe}.ics` : 'renew404-all.ics'
}
