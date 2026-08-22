import type { AppSettings, PaymentRecord, ServiceCategory, SubscriptionService } from '../domain/models'
import { createDefaultSettings } from '../domain/models'
import { categoriesForServices, createSystemCategories, normalizeServiceCategory } from '../data/categories'
import { backupSchema } from '../domain/validation'
import { db, type Renew404Database } from '../db/database'
import { settingsSchema } from '../domain/validation'
import { detectSystemLocale, t } from '../i18n'

export interface Renew404Backup {
  format: 'renew404-backup'
  version: 1
  exportedAt: string
  appVersion: string
  data: { services: SubscriptionService[]; payments: PaymentRecord[]; settings: AppSettings; categories: ServiceCategory[] }
}

export async function createBackup(database: Renew404Database = db, now = new Date().toISOString()): Promise<Renew404Backup> {
  const [services, payments, savedSettings, categories] = await Promise.all([
    database.services.toArray(), database.payments.toArray(), database.settings.get('settings'), database.categories.toArray(),
  ])
  const settings = { ...settingsSchema.parse(savedSettings || createDefaultSettings(now)), lastBackupAt: now, updatedAt: now }
  await database.settings.put(settings)
  return {
    format: 'renew404-backup', version: 1, exportedAt: now, appVersion: __APP_VERSION__,
    data: { services, payments, settings, categories: completeCategories(categories, services, now) },
  }
}

export function parseBackup(input: string | unknown): Renew404Backup {
  let raw: unknown
  try { raw = typeof input === 'string' ? JSON.parse(input) : input }
  catch { throw new Error(t('备份不是有效的 JSON 文件')) }
  if (raw && typeof raw === 'object') {
    const candidate = raw as { data?: { settings?: Partial<AppSettings> } }
    if (candidate.data?.settings && !candidate.data.settings.locale) {
      raw = {
        ...candidate,
        data: {
          ...candidate.data,
          settings: { ...candidate.data.settings, locale: detectSystemLocale() },
        },
      }
    }
  }
  const result = backupSchema.safeParse(raw)
  if (!result.success) {
    const issue = result.error.issues[0]
    throw new Error(`${t('备份格式无效')}：${issue?.path.join('.') || t('未知字段')} ${issue?.message || ''}`.trim())
  }
  const parsed = result.data
  const services = parsed.data.services.map(normalizeServiceCategory)
  return {
    ...parsed,
    data: {
      ...parsed.data,
      services,
      categories: completeCategories(parsed.data.categories || [], services, parsed.exportedAt),
    },
  } as Renew404Backup
}

function newer<T extends { id: string }>(current: T | undefined, incoming: T, getDate: (item: T) => string): T {
  return !current || getDate(incoming) > getDate(current) ? incoming : current
}

export function mergeBackupData(current: Renew404Backup['data'], incoming: Renew404Backup['data']): Renew404Backup['data'] {
  const services = new Map(current.services.map((item) => [item.id, item]))
  for (const item of incoming.services) services.set(item.id, newer(services.get(item.id), item, (value) => value.updatedAt))
  const payments = new Map(current.payments.map((item) => [item.id, item]))
  for (const item of incoming.payments) payments.set(item.id, newer(payments.get(item.id), item, (value) => value.completedAt))
  const settings = incoming.settings.updatedAt > current.settings.updatedAt ? incoming.settings : current.settings
  return {
    services: [...services.values()], payments: [...payments.values()], settings,
    categories: mergeCategories(current.categories || [], incoming.categories || []),
  }
}

function mergeCategories(current: ServiceCategory[], incoming: ServiceCategory[]): ServiceCategory[] {
  const categories = new Map(current.map((item) => [item.id, item]))
  for (const item of incoming) categories.set(item.id, newer(categories.get(item.id), item, (value) => value.updatedAt))
  for (const system of createSystemCategories()) categories.set(system.id, system)
  return [...categories.values()].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'zh-CN'))
}

function completeCategories(
  stored: ServiceCategory[],
  services: SubscriptionService[],
  now = new Date().toISOString(),
): ServiceCategory[] {
  const categories = new Map(stored.map((item) => [item.id, item]))
  for (const derived of categoriesForServices(services, now)) {
    if (!categories.has(derived.id)) categories.set(derived.id, derived)
  }
  for (const system of createSystemCategories(now)) categories.set(system.id, system)
  return [...categories.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'zh-CN'),
  )
}

export async function importBackup(backup: Renew404Backup, mode: 'replace' | 'merge', database: Renew404Database = db) {
  await database.transaction('rw', database.services, database.payments, database.settings, database.categories, async () => {
    let data = JSON.parse(JSON.stringify(backup.data)) as Renew404Backup['data']
    if (mode === 'merge') {
      const currentSettings = await database.settings.get('settings') || createDefaultSettings()
      data = mergeBackupData({
        services: await database.services.toArray(), payments: await database.payments.toArray(), settings: currentSettings,
        categories: await database.categories.toArray(),
      }, backup.data)
    }
    await Promise.all([database.services.clear(), database.payments.clear(), database.settings.clear(), database.categories.clear()])
    await database.services.bulkAdd(data.services)
    await database.payments.bulkAdd(data.payments)
    await database.settings.add(data.settings)
    await database.categories.bulkAdd(completeCategories(data.categories, data.services))
  })
}

export function backupFilename(date = new Date()): string {
  return `renew404-backup-${date.toISOString().slice(0, 10)}.json`
}
