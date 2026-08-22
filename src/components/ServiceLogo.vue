<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { ServiceCategory } from '../domain/models'
import { getServiceLogo } from '../data/serviceLogos'
import CategoryIcon from './CategoryIcon.vue'

const props = withDefaults(
  defineProps<{
    iconKey?: string
    name: string
    color?: string
    category?: Pick<ServiceCategory, 'iconKey' | 'color'>
    size?: 'sm' | 'md' | 'lg'
  }>(),
  { iconKey: undefined, category: undefined, color: '#ff5a00', size: 'md' },
)

const brand = computed(() => getServiceLogo(props.iconKey))
const initial = computed(() => props.name.trim().slice(0, 1).toLocaleUpperCase() || '?')
const accent = computed(() => props.color || props.category?.color || '#ff5a00')
</script>

<template>
  <span
    class="service-logo"
    :class="`service-logo--${size}`"
    :style="{ '--logo-accent': accent }"
  >
    <img
      v-if="brand?.url"
      data-testid="brand-logo"
      :src="brand.url"
      :alt="`${name} Logo`"
    >
    <svg
      v-else-if="brand?.path"
      data-testid="brand-logo"
      viewBox="0 0 24 24"
      role="img"
      :aria-label="`${name} Logo`"
    >
      <path
        :d="brand.path"
        :fill="`#${brand.hex}`"
      />
    </svg>
    <Icon
      v-else-if="brand?.icon"
      data-testid="brand-logo"
      :icon="brand.icon"
      :aria-label="`${name} Logo`"
      :style="{ color: `#${brand.hex}` }"
    />
    <CategoryIcon
      v-else-if="category"
      data-testid="category-logo-fallback"
      :icon-key="category.iconKey"
      :size="size === 'lg' ? 30 : 20"
    />
    <span
      v-else
      data-testid="initial-logo-fallback"
      class="service-logo__initial"
    >{{
      initial
    }}</span>
  </span>
</template>

<style scoped>
.service-logo {
  --logo-size: 48px;
  display: inline-grid;
  width: var(--logo-size);
  height: var(--logo-size);
  flex: 0 0 var(--logo-size);
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--logo-accent) 42%, var(--line));
  border-radius: 14px;
  background: #fffdf6;
  color: var(--logo-accent);
  box-shadow: inset 0 -3px 0 color-mix(in srgb, var(--logo-accent) 26%, transparent);
}
.service-logo--sm {
  --logo-size: 34px;
  border-radius: 10px;
}
.service-logo--lg {
  --logo-size: 66px;
  border-radius: 18px;
}
.service-logo img,
.service-logo svg {
  width: 68%;
  height: 68%;
  object-fit: contain;
}
.service-logo__initial {
  font: 800 1rem/1 var(--font-display);
}
.service-logo--lg .service-logo__initial {
  font-size: 1.45rem;
}
</style>
