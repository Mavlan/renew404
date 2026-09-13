<script setup lang="ts">
import { ChartNoAxesColumnIncreasing, House, Settings, WalletCards } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../i18n'

const route = useRoute()
const { t, locale } = useI18n()
const studioOrigin = ['127.0.0.1', 'localhost'].includes(window.location.hostname)
  ? `http://${window.location.hostname}:4310/`
  : 'https://try404.com/'
const studioUrl = computed(() => `${studioOrigin}?lang=${locale.value.startsWith('zh') ? 'zh' : 'en'}`)
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
      class="nav-brand"
      to="/"
    >
      <img
        src="/favicon.svg"
        alt=""
        width="30"
        height="30"
      ><strong>Renew<span>404</span></strong>
    </RouterLink>
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
    <div class="nav-foot">
      <p>{{ t('nav.local') }}</p><a :href="studioUrl">{{ t('nav.studio') }}</a>
    </div>
  </nav>
</template>
