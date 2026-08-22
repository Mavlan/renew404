import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { db } from '../db/database'
import { repository } from '../db/repositories'
import type { AppLocale, AppSettings, PaymentStatus, ServiceCategory, SubscriptionService } from '../domain/models'
import { createCustomCategory } from '../data/categories'
import { applyTheme } from '../services/theme'
import { setLocale, t } from '../i18n'

export const useAppStore = defineStore('app', () => {
  const ready = ref(false)
  const services = ref<SubscriptionService[]>([])
  const payments = ref<Awaited<ReturnType<typeof repository.listPayments>>>([])
  const settings = ref<AppSettings | null>(null)
  const categoryRecords = ref<ServiceCategory[]>([])

  const activeServices = computed(() => services.value.filter((item) => item.status === 'active'))
  const categories = computed(() => categoryRecords.value)

  async function refresh() {
    const [nextServices, nextPayments, nextSettings, nextCategories] = await Promise.all([
      repository.listServices(), repository.listPayments(), repository.getSettings(), repository.listCategories(),
    ])
    services.value = nextServices
    payments.value = nextPayments
    settings.value = nextSettings
    setLocale(nextSettings.locale)
    applyTheme(nextSettings.theme)
    categoryRecords.value = nextCategories
    ready.value = true
  }

  async function createCategory(name: string) {
    const existing = categoryRecords.value.find((item) => item.name.toLocaleLowerCase() === name.trim().toLocaleLowerCase())
    if (existing) return existing
    const category = createCustomCategory(name)
    await repository.saveCategory(category)
    await refresh()
    return category
  }

  async function saveService(service: SubscriptionService) {
    await repository.saveService(service)
    await refresh()
  }

  async function processPayment(id: string, status: PaymentStatus) {
    await repository.processPayment(id, status)
    await refresh()
  }

  async function setStatus(id: string, status: SubscriptionService['status']) {
    const service = await repository.getService(id)
    if (!service) throw new Error(t('error.serviceNotFound'))
    await repository.saveService({ ...service, status, updatedAt: new Date().toISOString() })
    await refresh()
  }

  async function deleteService(id: string) {
    await repository.deleteService(id)
    await refresh()
  }

  async function saveSettings(next: AppSettings) {
    await repository.saveSettings({ ...next, updatedAt: new Date().toISOString() })
    await refresh()
  }

  async function saveLocale(locale: AppLocale) {
    if (!settings.value) return
    if (settings.value.locale === locale) {
      setLocale(locale)
      return
    }
    const next = { ...settings.value, locale, updatedAt: new Date().toISOString() }
    await repository.saveSettings(next)
    settings.value = next
    setLocale(locale)
  }

  async function clearAll() {
    await db.transaction('rw', db.services, db.payments, db.settings, db.categories, async () => {
      await Promise.all([db.services.clear(), db.payments.clear(), db.settings.clear(), db.categories.clear()])
    })
    await refresh()
  }

  return {
    ready, services, payments, settings, activeServices, categories,
    refresh, saveService, createCategory, processPayment, setStatus, deleteService, saveSettings, saveLocale, clearAll,
  }
})
