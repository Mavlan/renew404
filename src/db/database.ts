import Dexie, { type EntityTable } from 'dexie'
import type { AppSettings, PaymentRecord, ServiceCategory, SubscriptionService } from '../domain/models'
import { categoriesForServices, normalizeServiceCategory } from '../data/categories'

export class Renew404Database extends Dexie {
  services!: EntityTable<SubscriptionService, 'id'>
  payments!: EntityTable<PaymentRecord, 'id'>
  settings!: EntityTable<AppSettings, 'id'>
  categories!: EntityTable<ServiceCategory, 'id'>

  constructor(name = 'renew404') {
    super(name)
    this.version(1).stores({
      services: 'id, name, category, status, nextRenewalDate, updatedAt',
      payments: 'id, serviceId, dueDate, status, completedAt',
      settings: 'id',
    })
    this.version(2).stores({
      services: 'id, name, category, categoryId, status, nextRenewalDate, updatedAt',
      payments: 'id, serviceId, dueDate, status, completedAt',
      settings: 'id',
      categories: 'id, name, isSystem, sortOrder, updatedAt',
    }).upgrade(async (transaction) => {
      const services = await transaction.table<SubscriptionService, string>('services').toArray()
      const normalized = services.map(normalizeServiceCategory)
      if (normalized.length) await transaction.table('services').bulkPut(normalized)
      await transaction.table('categories').bulkPut(categoriesForServices(normalized))
    })
  }
}

export const db = new Renew404Database()
