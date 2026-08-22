<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '../app/store'
import ConfirmSheet from '../components/ConfirmSheet.vue'
import CurrencyAmount from '../components/CurrencyAmount.vue'
import EmptyState from '../components/EmptyState.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import RenewalCard from '../components/RenewalCard.vue'
import type { SubscriptionService } from '../domain/models'
import { getNextRenewalDate } from '../domain/recurrence'
import { dueWithinDays, overdueServices, paidForMonth, plannedForMonth } from '../domain/statistics'
import { todayInTimeZone } from '../services/time'
import { formatLocalizedMonth, useI18n } from '../i18n'

const store = useAppStore()
const { t } = useI18n()
const selected = ref<SubscriptionService | null>(null)
const today = computed(() => todayInTimeZone(store.settings?.defaultTimeZone))
const month = computed(() => today.value.slice(0, 7))
const monthName = computed(() => t('month.renewals', { month: formatLocalizedMonth(month.value) }))
const monthServices = computed(() => store.services.filter((item) => item.status === 'active' && item.nextRenewalDate.startsWith(month.value)))
const upcoming = computed(() => dueWithinDays(store.services, today.value, 7))
const overdue = computed(() => overdueServices(store.services, today.value))
const planned = computed(() => plannedForMonth(store.services, month.value))
const paid = computed(() => paidForMonth(store.payments, month.value))
const greeting = computed(() => new Date().getHours() < 12 ? t('greeting.morning') : new Date().getHours() < 18 ? t('greeting.afternoon') : t('greeting.evening'))

async function skip(service: SubscriptionService) { await store.processPayment(service.id, 'skipped') }
async function confirmPaid() {
  if (!selected.value) return
  await store.processPayment(selected.value.id, 'paid')
  selected.value = null
}
async function finishOnboarding() {
  if (store.settings) await store.saveSettings({ ...store.settings, onboardingComplete: true })
}
</script>

<template>
  <section
    v-if="store.ready"
    class="page stack-xl"
  >
    <div
      v-if="!store.settings?.onboardingComplete && store.services.length === 0"
      class="onboarding"
    >
      <LanguageSwitcher class="onboarding-language" />
      <p class="eyebrow">
        LOCAL FIRST / NO ACCOUNT
      </p>
      <h1>{{ t('续费不该突然 404。') }}</h1>
      <p class="lede">
        {{ t('Renew404 在本机记录周期性续费。没有账号，没有云端，也没有付费 API。') }}
      </p>
      <ol class="onboarding-points">
        <li><b>01</b><span>{{ t('数据默认只保存在此设备的 IndexedDB。') }}</span></li>
        <li><b>02</b><span>{{ t('建议定期导出 JSON 备份。') }}</span></li>
        <li><b>03</b><span>{{ t('精确提醒通过手动导入 .ics 日历文件实现。') }}</span></li>
      </ol>
      <div class="action-stack">
        <RouterLink
          class="button primary wide"
          to="/services/new"
          @click="finishOnboarding"
        >
          {{ t('添加第一个服务') }}
        </RouterLink>
        <RouterLink
          class="button secondary wide"
          to="/settings"
        >
          {{ t('从备份恢复') }}
        </RouterLink>
      </div>
    </div>
    <template v-else>
      <header class="dashboard-header">
        <div>
          <p class="eyebrow">
            {{ greeting }}
          </p><h1>{{ monthName }}</h1>
        </div>
        <div class="dashboard-tools">
          <LanguageSwitcher />
          <RouterLink
            class="icon-button"
            to="/services/new"
            :aria-label="t('新增服务')"
          >
            ＋
          </RouterLink>
        </div>
      </header>
      <article class="summary-card">
        <div>
          <span>{{ t('本月计划') }}</span><div class="amount-group">
            <CurrencyAmount
              v-for="(amount, currency) in planned"
              :key="currency"
              :amount-minor="amount ?? 0"
              :currency="currency"
            /><em v-if="Object.keys(planned).length === 0">{{ t('暂无计划') }}</em>
          </div>
        </div>
        <div class="summary-rule" />
        <div>
          <span>{{ t('本月已支付') }}</span><div class="amount-group secondary-amount">
            <CurrencyAmount
              v-for="(amount, currency) in paid"
              :key="currency"
              :amount-minor="amount ?? 0"
              :currency="currency"
            /><em v-if="Object.keys(paid).length === 0">{{ t('暂无记录') }}</em>
          </div>
        </div>
        <p class="summary-foot">
          {{ t('未来 7 天') }}：<strong>{{ t('count.items', { count: upcoming.length }) }}</strong>
        </p>
      </article>
      <section
        v-if="overdue.length"
        class="content-section"
      >
        <div class="section-heading">
          <h2>{{ t('已逾期') }}</h2><span class="danger-dot">{{ overdue.length }}</span>
        </div><div class="card-list">
          <RenewalCard
            v-for="service in overdue"
            :key="service.id"
            :service="service"
            @paid="selected = $event"
            @skip="skip"
          />
        </div>
      </section>
      <section
        v-if="upcoming.length"
        class="content-section"
      >
        <div class="section-heading">
          <h2>{{ t('未来 7 天') }}</h2><span>{{ t('count.items', { count: upcoming.length }) }}</span>
        </div><div class="card-list">
          <RenewalCard
            v-for="service in upcoming"
            :key="service.id"
            :service="service"
            @paid="selected = $event"
            @skip="skip"
          />
        </div>
      </section>
      <section class="content-section">
        <div class="section-heading">
          <h2>{{ t('本月全部') }}</h2><span>{{ t('count.items', { count: monthServices.length }) }}</span>
        </div><div
          v-if="monthServices.length"
          class="card-list"
        >
          <RenewalCard
            v-for="service in monthServices"
            :key="service.id"
            :service="service"
            @paid="selected = $event"
            @skip="skip"
          />
        </div><EmptyState
          v-else
          :title="t('本月没有待续费项目')"
          :description="t('新服务会按下一次续费日期出现在这里。')"
        >
          <RouterLink
            class="button primary"
            to="/services/new"
          >
            {{ t('新增服务') }}
          </RouterLink>
        </EmptyState>
      </section>
    </template>
  </section>
  <div
    v-else
    class="loading-state"
  >
    {{ t('正在读取本地账本…') }}
  </div>
  <ConfirmSheet
    :open="Boolean(selected)"
    :title="t('确认本期已支付？')"
    :confirm-label="t('确认已支付')"
    @close="selected = null"
    @confirm="confirmPaid"
  >
    <template v-if="selected">
      <dl class="confirm-details">
        <div>
          <dt>{{ t('本次金额') }}</dt><dd>
            <CurrencyAmount
              :amount-minor="selected.amountMinor"
              :currency="selected.currency"
            />
          </dd>
        </div><div><dt>{{ t('本次日期') }}</dt><dd>{{ selected.nextRenewalDate }}</dd></div><div><dt>{{ t('下次日期') }}</dt><dd>{{ getNextRenewalDate(selected) }}</dd></div>
      </dl>
    </template>
  </ConfirmSheet>
</template>
