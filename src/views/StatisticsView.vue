<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../app/store'
import CurrencyAmount from '../components/CurrencyAmount.vue'
import EmptyState from '../components/EmptyState.vue'
import { paidForMonth, plannedForMonth, totalsByCategory } from '../domain/statistics'
import { differenceInCalendarDaysLocal } from '../domain/recurrence'
import { sumByCurrency } from '../domain/money'
import { todayInTimeZone } from '../services/time'
import { localizedCategoryName, useI18n } from '../i18n'

const store = useAppStore()
const { t } = useI18n()
const displayCategoryName = (name: string) => localizedCategoryName(store.categories.find((item) => item.name === name)) || name
const today = computed(() => todayInTimeZone(store.settings?.defaultTimeZone))
const month = computed(() => today.value.slice(0, 7))
const planned = computed(() => plannedForMonth(store.services, month.value))
const paid = computed(() => paidForMonth(store.payments, month.value))
const next30 = computed(() => sumByCurrency(store.services.filter((item) => {
  const diff = differenceInCalendarDaysLocal(item.nextRenewalDate, today.value)
  return item.status === 'active' && diff >= 0 && diff <= 30
})))
const twelveMonthsAgo = computed(() => { const date = new Date(); date.setMonth(date.getMonth() - 12); return date.toISOString().slice(0, 10) })
const paid12 = computed(() => sumByCurrency(store.payments.filter((item) => item.status === 'paid' && item.dueDate >= twelveMonthsAgo.value)))
const categories = computed(() => totalsByCategory(store.services, month.value))
const hasData = computed(() => store.services.length > 0 || store.payments.length > 0)
</script>

<template>
  <section class="page stack-xl">
    <header>
      <p class="eyebrow">
        LEDGER / NO EXCHANGE RATE
      </p><h1>{{ t('统计') }}</h1><p class="lede">
        {{ t('所有金额按原始币种分别展示，不做未经授权的汇率换算。') }}
      </p>
    </header>
    <template v-if="hasData">
      <div class="metric-grid">
        <article>
          <span>{{ t('本月计划') }}</span><div class="metric-values">
            <CurrencyAmount
              v-for="(value, currency) in planned"
              :key="currency"
              :amount-minor="value ?? 0"
              :currency="currency"
            /><em v-if="!Object.keys(planned).length">{{ t('暂无') }}</em>
          </div>
        </article><article>
          <span>{{ t('本月已支付') }}</span><div class="metric-values">
            <CurrencyAmount
              v-for="(value, currency) in paid"
              :key="currency"
              :amount-minor="value ?? 0"
              :currency="currency"
            /><em v-if="!Object.keys(paid).length">{{ t('暂无') }}</em>
          </div>
        </article><article>
          <span>{{ t('未来 30 天') }}</span><div class="metric-values">
            <CurrencyAmount
              v-for="(value, currency) in next30"
              :key="currency"
              :amount-minor="value ?? 0"
              :currency="currency"
            /><em v-if="!Object.keys(next30).length">{{ t('暂无') }}</em>
          </div>
        </article><article>
          <span>{{ t('近 12 月实付') }}</span><div class="metric-values">
            <CurrencyAmount
              v-for="(value, currency) in paid12"
              :key="currency"
              :amount-minor="value ?? 0"
              :currency="currency"
            /><em v-if="!Object.keys(paid12).length">{{ t('暂无') }}</em>
          </div>
        </article>
      </div>
      <section class="detail-section">
        <div class="section-heading">
          <h2>{{ t('本月按分类') }}</h2><span>{{ t('count.items', { count: Object.keys(categories).length }) }}</span>
        </div><div
          v-if="Object.keys(categories).length"
          class="category-list"
        >
          <div
            v-for="(totals, category) in categories"
            :key="category"
          >
            <strong>{{ displayCategoryName(category) }}</strong><span><CurrencyAmount
              v-for="(value, currency) in totals"
              :key="currency"
              :amount-minor="value ?? 0"
              :currency="currency"
            /></span>
          </div>
        </div><p
          v-else
          class="muted"
        >
          {{ t('本月没有计划支出。') }}
        </p>
      </section>
    </template>
    <EmptyState
      v-else
      :title="t('还没有可统计的数据')"
      :description="t('添加服务并记录付款后，这里会按币种展示计划与实际支出。')"
    />
  </section>
</template>
