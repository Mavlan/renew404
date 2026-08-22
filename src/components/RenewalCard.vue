<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../app/store'
import type { SubscriptionService } from '../domain/models'
import CurrencyAmount from './CurrencyAmount.vue'
import CountdownBadge from './CountdownBadge.vue'
import CategoryIcon from './CategoryIcon.vue'
import ServiceLogo from './ServiceLogo.vue'
import { localizedCategoryName, useI18n } from '../i18n'

const props = defineProps<{ service: SubscriptionService; compact?: boolean }>()
const emit = defineEmits<{
  paid: [service: SubscriptionService]
  skip: [service: SubscriptionService]
}>()
const store = useAppStore()
const { t } = useI18n()
const category = computed(
  () =>
    store.categories.find((item) => item.id === props.service.categoryId) ||
    store.categories.find((item) => item.name === props.service.category),
)
</script>

<template>
  <article
    class="renewal-card"
    :style="{ '--card-accent': service.color }"
  >
    <RouterLink
      class="card-main"
      :to="`/services/${service.id}`"
    >
      <span
        v-if="service.iconType === 'emoji' && !service.iconKey"
        class="service-icon"
        aria-hidden="true"
      >{{ service.iconValue || '✦' }}</span>
      <ServiceLogo
        v-else
        :icon-key="service.iconKey"
        :name="service.iconValue || service.name"
        :color="service.color"
        :category="category"
      />
      <span class="service-copy">
        <strong>{{ service.name }}</strong>
        <span class="service-meta">{{ t('下次') }} {{ service.nextRenewalDate }} · {{ service.renewalTime || '09:00' }}</span>
        <span class="category-tag"><CategoryIcon
          v-if="category"
          :icon-key="category.iconKey"
          :size="13"
        />{{
          localizedCategoryName(category) || service.category
        }}</span>
      </span>
      <span class="service-amount"><CurrencyAmount
        :amount-minor="service.amountMinor"
        :currency="service.currency"
        :custom-label="service.customCurrencyLabel"
      /><CountdownBadge
        :date="service.nextRenewalDate"
        :time-zone="service.timeZone"
      /></span>
    </RouterLink>
    <div
      v-if="!compact && service.status === 'active'"
      class="card-actions"
    >
      <button
        type="button"
        @click="emit('paid', service)"
      >
        {{ t('已支付') }}
      </button>
      <button
        type="button"
        @click="emit('skip', service)"
      >
        {{ t('跳过') }}
      </button>
      <RouterLink :to="`/services/${service.id}/edit`">
        {{ t('编辑') }}
      </RouterLink>
    </div>
    <span
      v-else-if="service.status !== 'active'"
      class="status-label"
    >{{
      service.status === 'paused' ? t('已暂停') : t('已取消')
    }}</span>
  </article>
</template>
