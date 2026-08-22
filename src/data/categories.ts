import type { CategoryIconKey, ServiceCategory, SubscriptionService } from '../domain/models'

type CategorySeed = Pick<ServiceCategory, 'id' | 'name' | 'iconKey' | 'color' | 'sortOrder'>

export const SYSTEM_CATEGORY_SEEDS: readonly CategorySeed[] = [
  { id: 'ai-creative', name: 'AI 与创作', iconKey: 'sparkles', color: '#ff5a00', sortOrder: 10 },
  { id: 'development-tools', name: '开发工具', iconKey: 'code-2', color: '#2563eb', sortOrder: 20 },
  {
    id: 'cloud-servers',
    name: '云服务与服务器',
    iconKey: 'cloud-cog',
    color: '#0891b2',
    sortOrder: 30,
  },
  {
    id: 'domains-websites',
    name: '域名与网站',
    iconKey: 'globe-2',
    color: '#0d9488',
    sortOrder: 40,
  },
  {
    id: 'office-productivity',
    name: '办公与效率',
    iconKey: 'briefcase-business',
    color: '#7c3aed',
    sortOrder: 50,
  },
  {
    id: 'storage-backup',
    name: '存储与备份',
    iconKey: 'hard-drive-download',
    color: '#0284c7',
    sortOrder: 60,
  },
  {
    id: 'video-streaming',
    name: '视频与流媒体',
    iconKey: 'clapperboard',
    color: '#dc2626',
    sortOrder: 70,
  },
  { id: 'music-audio', name: '音乐与音频', iconKey: 'headphones', color: '#16a34a', sortOrder: 80 },
  { id: 'gaming', name: '游戏', iconKey: 'gamepad-2', color: '#9333ea', sortOrder: 90 },
  {
    id: 'social-membership',
    name: '社交与会员',
    iconKey: 'users-round',
    color: '#db2777',
    sortOrder: 100,
  },
  { id: 'network-proxy', name: '网络与代理', iconKey: 'network', color: '#475569', sortOrder: 110 },
  {
    id: 'communications',
    name: '通讯与运营商',
    iconKey: 'radio-tower',
    color: '#ea580c',
    sortOrder: 120,
  },
  {
    id: 'shopping-lifestyle',
    name: '购物与生活',
    iconKey: 'shopping-bag',
    color: '#e11d48',
    sortOrder: 130,
  },
  {
    id: 'finance-insurance',
    name: '金融与保险',
    iconKey: 'landmark',
    color: '#ca8a04',
    sortOrder: 140,
  },
  {
    id: 'education-learning',
    name: '教育与学习',
    iconKey: 'graduation-cap',
    color: '#4f46e5',
    sortOrder: 150,
  },
  {
    id: 'travel-transport',
    name: '旅行与交通',
    iconKey: 'plane',
    color: '#0f766e',
    sortOrder: 160,
  },
  { id: 'other', name: '其他', iconKey: 'shapes', color: '#78716c', sortOrder: 170 },
] as const

export const DEFAULT_CATEGORIES = SYSTEM_CATEGORY_SEEDS.map((category) => category.name)

export function createSystemCategories(now = new Date().toISOString()): ServiceCategory[] {
  return SYSTEM_CATEGORY_SEEDS.map((category) => ({
    ...category,
    isSystem: true,
    createdAt: now,
    updatedAt: now,
  }))
}

export function categoryById(id?: string) {
  return SYSTEM_CATEGORY_SEEDS.find((category) => category.id === id)
}

export function categoryByName(name?: string) {
  return SYSTEM_CATEGORY_SEEDS.find((category) => category.name === name)
}

function stableHash(value: string): string {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.codePointAt(0) || 0
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

export function customCategoryId(name: string): string {
  return `custom-${stableHash(name.trim().toLocaleLowerCase())}`
}

export function createCustomCategory(
  name: string,
  now = new Date().toISOString(),
): ServiceCategory {
  const cleanName = name.trim()
  return {
    id: customCategoryId(cleanName),
    name: cleanName,
    iconKey: 'shapes' satisfies CategoryIconKey,
    color: '#78716c',
    sortOrder: 1000,
    isSystem: false,
    createdAt: now,
    updatedAt: now,
  }
}

export function normalizeServiceCategory(service: SubscriptionService): SubscriptionService {
  if (service.categoryId) return service
  const category = service.category.trim() || '其他'
  const matched = categoryByName(category)
  return { ...service, category, categoryId: matched?.id || customCategoryId(category) }
}

export function categoriesForServices(
  services: SubscriptionService[],
  now = new Date().toISOString(),
): ServiceCategory[] {
  const categories = new Map(createSystemCategories(now).map((category) => [category.id, category]))
  for (const service of services) {
    const normalized = normalizeServiceCategory(service)
    if (!categories.has(normalized.categoryId!)) {
      const custom = createCustomCategory(service.category || '其他', service.createdAt || now)
      categories.set(custom.id, { ...custom, updatedAt: service.updatedAt || now })
    }
  }
  return [...categories.values()]
}
