<script setup lang="ts">
import { ChartNoAxesColumnIncreasing, House, Settings, WalletCards } from '@lucide/vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../i18n'

const route = useRoute()
const { t } = useI18n()
const items = [
  { to: '/', labelKey: '本月', icon: House, iconKey: 'house' },
  { to: '/services', labelKey: '服务', icon: WalletCards, iconKey: 'wallet-cards' },
  { to: '/statistics', labelKey: '统计', icon: ChartNoAxesColumnIncreasing, iconKey: 'chart-columns' },
  { to: '/settings', labelKey: '设置', icon: Settings, iconKey: 'settings' },
]

function isSelected(path: string) {
  if (path === '/') return route.name === 'dashboard'
  if (path === '/services') return route.path.startsWith('/services')
  return route.path === path
}
</script>

<template>
  <nav
    class="bottom-nav"
    :aria-label="t('主导航')"
  >
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :class="['nav-item', { 'is-selected': isSelected(item.to) }]"
      :aria-current="isSelected(item.to) ? 'page' : undefined"
    >
      <span
        class="nav-icon"
        :data-icon="item.iconKey"
        aria-hidden="true"
      ><component
        :is="item.icon"
        :size="19"
        :stroke-width="1.8"
      /></span>
      <span>{{ t(item.labelKey) }}</span>
    </RouterLink>
  </nav>
</template>
