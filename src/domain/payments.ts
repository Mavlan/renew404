import type { PaymentRecord, PaymentStatus, SubscriptionService } from './models'
import { getNextRenewalDate } from './recurrence'

export function processRenewal(
  service: SubscriptionService,
  status: PaymentStatus,
  completedAt = new Date().toISOString(),
  id: string = crypto.randomUUID(),
): { service: SubscriptionService; payment: PaymentRecord } {
  const payment: PaymentRecord = {
    id,
    serviceId: service.id,
    dueDate: service.nextRenewalDate,
    dueTime: service.renewalTime,
    amountMinor: service.amountMinor,
    currency: service.currency,
    status,
    completedAt,
  }
  return {
    payment,
    service: {
      ...service,
      nextRenewalDate: getNextRenewalDate(service),
      updatedAt: completedAt,
    },
  }
}
