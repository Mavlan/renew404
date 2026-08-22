import type { CurrencyCode, PaymentRecord, SubscriptionService } from './models'
import { sumByCurrency } from './money'
import { differenceInCalendarDaysLocal } from './recurrence'

export type CurrencyTotals = Partial<Record<CurrencyCode, number>>

export function plannedForMonth(services: SubscriptionService[], month: string): CurrencyTotals {
  return sumByCurrency(
    services.filter((service) => service.status === 'active' && service.nextRenewalDate.startsWith(month)),
  )
}

export function paidForMonth(records: PaymentRecord[], month: string): CurrencyTotals {
  return sumByCurrency(records.filter((record) => record.status === 'paid' && record.dueDate.startsWith(month)))
}

export function dueWithinDays(
  services: SubscriptionService[],
  today: string,
  days: number,
): SubscriptionService[] {
  return services
    .filter((service) => {
      const difference = differenceInCalendarDaysLocal(service.nextRenewalDate, today)
      return service.status === 'active' && difference >= 0 && difference <= days
    })
    .sort((a, b) => a.nextRenewalDate.localeCompare(b.nextRenewalDate))
}

export function overdueServices(services: SubscriptionService[], today: string): SubscriptionService[] {
  return services
    .filter(
      (service) =>
        service.status === 'active' && differenceInCalendarDaysLocal(service.nextRenewalDate, today) < 0,
    )
    .sort((a, b) => a.nextRenewalDate.localeCompare(b.nextRenewalDate))
}

export function totalsByCategory(services: SubscriptionService[], month: string) {
  const result: Record<string, CurrencyTotals> = {}
  for (const service of services) {
    if (service.status !== 'active' || !service.nextRenewalDate.startsWith(month)) continue
    result[service.category] ??= {}
    result[service.category][service.currency] =
      (result[service.category][service.currency] ?? 0) + service.amountMinor
  }
  return result
}
