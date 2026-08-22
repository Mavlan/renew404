import type { AppSettings, PaymentStatus, ServiceCategory, SubscriptionService } from '../domain/models'
import { createDefaultSettings } from '../domain/models'
import { createSystemCategories } from '../data/categories'
import { processRenewal } from '../domain/payments'
import { settingsSchema } from '../domain/validation'
import { detectSystemLocale, t } from '../i18n'
import { db, type Renew404Database } from './database'

function toStorable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export class Renew404Repository {
  private readonly database: Renew404Database

  constructor(database: Renew404Database = db) {
    this.database = database
  }

  listServices() {
    return this.database.services.orderBy('nextRenewalDate').toArray()
  }

  getService(id: string) {
    return this.database.services.get(id)
  }

  saveService(service: SubscriptionService) {
    return this.database.services.put(toStorable(service))
  }

  async listCategories(): Promise<ServiceCategory[]> {
    const stored = await this.database.categories.toArray()
    const system = createSystemCategories()
    const missing = system.filter((item) => !stored.some((saved) => saved.id === item.id))
    if (missing.length) await this.database.categories.bulkPut(missing)
    return [...stored.filter((item) => !missing.some((added) => added.id === item.id)), ...missing]
      .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'zh-CN'))
  }

  saveCategory(category: ServiceCategory) {
    return this.database.categories.put(toStorable(category))
  }

  async deleteService(id: string) {
    await this.database.transaction('rw', this.database.services, this.database.payments, async () => {
      await this.database.payments.where('serviceId').equals(id).delete()
      await this.database.services.delete(id)
    })
  }

  async processPayment(id: string, status: PaymentStatus) {
    return this.database.transaction('rw', this.database.services, this.database.payments, async () => {
      const service = await this.database.services.get(id)
      if (!service) throw new Error(t('error.serviceNotFound'))
      const result = processRenewal(service, status)
      await this.database.payments.add(result.payment)
      await this.database.services.put(result.service)
      return result
    })
  }

  listPayments(serviceId?: string) {
    return serviceId
      ? this.database.payments.where('serviceId').equals(serviceId).reverse().sortBy('completedAt')
      : this.database.payments.orderBy('completedAt').reverse().toArray()
  }

  async getSettings(): Promise<AppSettings> {
    const saved = await this.database.settings.get('settings')
    if (saved) {
      const savedLocale = (saved as Partial<AppSettings>).locale
      const settings = settingsSchema.parse({
        ...saved,
        locale: savedLocale || detectSystemLocale(),
      })
      if (!savedLocale) await this.database.settings.put(settings)
      return settings
    }
    const settings = { ...createDefaultSettings(), locale: detectSystemLocale() }
    await this.database.settings.add(settings)
    return settings
  }

  saveSettings(settings: AppSettings) {
    return this.database.settings.put(toStorable(settings))
  }
}

export const repository = new Renew404Repository()
