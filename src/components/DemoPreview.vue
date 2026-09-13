<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarDays, Globe, Music2, Server } from '@lucide/vue'
import { useI18n } from '../i18n'

const { t, locale } = useI18n()
const weekOnly = ref(false)
const rows = [
  { key: 'server', icon: Server, amount: 7.5, days: 3 },
  { key: 'domain', icon: Globe, amount: 12, days: 7 },
  { key: 'music', icon: Music2, amount: 10.99, days: 16 },
]
const visibleRows = computed(() => rows.filter(row => !weekOnly.value || row.days <= 7))
const total = computed(() => visibleRows.value.reduce((sum, row) => sum + row.amount, 0).toFixed(2))
function dateInDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric' }).format(date)
}
</script>

<template>
  <section
    class="demo-preview"
    :aria-label="t('demo.label')"
    data-testid="demo-preview"
  >
    <header class="demo-masthead">
      <strong>Renew<span>404</span></strong><span class="demo-label">{{ t('demo.label') }}</span>
    </header>
    <div class="demo-summary">
      <div><p>{{ weekOnly ? t('demo.week') : t('demo.total') }}</p><strong class="demo-total">${{ total }}<small>USD</small></strong></div>
      <CalendarDays
        :size="40"
        :stroke-width="1.1"
        aria-hidden="true"
      />
    </div>
    <div
      class="demo-filter"
      :aria-label="t('demo.date')"
    >
      <button
        type="button"
        :aria-pressed="!weekOnly"
        @click="weekOnly = false"
      >
        {{ t('demo.all') }}
      </button>
      <button
        type="button"
        :aria-pressed="weekOnly"
        @click="weekOnly = true"
      >
        {{ t('demo.week') }}
      </button>
    </div>
    <div
      class="demo-ledger"
      aria-live="polite"
    >
      <div class="demo-table-head">
        <span>{{ t('demo.service') }}</span><span>{{ t('demo.date') }}</span><span>{{ t('demo.amount') }}</span>
      </div>
      <div
        v-for="row in visibleRows"
        :key="row.key"
        class="demo-row"
      >
        <span class="demo-service"><component
          :is="row.icon"
          :size="21"
          aria-hidden="true"
        /><strong>{{ t(`demo.${row.key}`) }}</strong></span>
        <span class="demo-date">{{ dateInDays(row.days) }}</span><strong>${{ row.amount.toFixed(2) }}</strong>
      </div>
    </div>
    <p class="demo-note">
      {{ t('demo.note') }}
    </p>
  </section>
</template>
