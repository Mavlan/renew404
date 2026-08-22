<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../app/store'
import ConfirmSheet from '../components/ConfirmSheet.vue'
import CurrencyAmount from '../components/CurrencyAmount.vue'
import CountdownBadge from '../components/CountdownBadge.vue'
import ServiceLogo from '../components/ServiceLogo.vue'
import { recurrenceLabel } from '../domain/recurrence'
import { calendarFilename, generateCalendar } from '../services/calendar'
import { shareOrDownload } from '../services/download'
import { formatLocalizedDateTime, localizedCategoryName, useI18n } from '../i18n'

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const service = computed(() => store.services.find((item) => item.id === route.params.id))
const history = computed(() => store.payments.filter((item) => item.serviceId === route.params.id))
const category = computed(
  () =>
    store.categories.find((item) => item.id === service.value?.categoryId) ||
    store.categories.find((item) => item.name === service.value?.category),
)
const dialog = ref<'paid' | 'delete' | null>(null)
async function paid() {
  if (service.value) await store.processPayment(service.value.id, 'paid')
  dialog.value = null
}
async function skip() {
  if (service.value) await store.processPayment(service.value.id, 'skipped')
}
async function remove() {
  if (!service.value) return
  await store.deleteService(service.value.id)
  await router.push('/services')
}
async function toggleStatus(kind: 'pause' | 'cancel') {
  if (!service.value) return
  const next =
    kind === 'pause'
      ? service.value.status === 'paused'
        ? 'active'
        : 'paused'
      : service.value.status === 'cancelled'
        ? 'active'
        : 'cancelled'
  await store.setStatus(service.value.id, next)
}
async function exportCalendar() {
  if (service.value)
    await shareOrDownload(
      generateCalendar([service.value]),
      calendarFilename(service.value),
      'text/calendar;charset=utf-8',
    )
}
</script>

<template>
  <section
    v-if="service"
    class="page detail-page stack-xl"
  >
    <header class="editor-header">
      <button
        class="back-button"
        type="button"
        :aria-label="t('返回')"
        @click="router.back()"
      >
        ←
      </button>
      <div>
        <p class="eyebrow">
          SERVICE / {{ service.status.toUpperCase() }}
        </p>
        <h1>{{ service.name }}</h1>
      </div>
      <RouterLink
        class="text-link"
        :to="`/services/${service.id}/edit`"
      >
        {{ t('编辑') }}
      </RouterLink>
    </header>
    <article
      class="detail-hero"
      :style="{ '--card-accent': service.color }"
    >
      <div
        v-if="service.iconType === 'emoji' && !service.iconKey"
        class="detail-icon"
      >
        {{ service.iconValue || '✦' }}
      </div>
      <ServiceLogo
        v-else
        :icon-key="service.iconKey"
        :name="service.iconValue || service.name"
        :color="service.color"
        :category="category"
        size="lg"
      />
      <div>
        <span>{{ t('下一次续费') }}</span><strong>{{ service.nextRenewalDate }} · {{ service.renewalTime || '09:00' }}</strong><CountdownBadge
          :date="service.nextRenewalDate"
          :time-zone="service.timeZone"
        />
      </div>
      <CurrencyAmount
        :amount-minor="service.amountMinor"
        :currency="service.currency"
      />
    </article>
    <div
      v-if="service.status === 'active'"
      class="primary-actions"
    >
      <button
        class="button primary"
        type="button"
        @click="dialog = 'paid'"
      >
        {{ t('标记已支付') }}
      </button><button
        class="button secondary"
        type="button"
        @click="skip"
      >
        {{ t('跳过本期') }}
      </button>
    </div>
    <section class="detail-section">
      <h2>{{ t('订阅信息') }}</h2>
      <dl class="data-list">
        <div>
          <dt>{{ t('分类') }}</dt>
          <dd>{{ localizedCategoryName(category) || service.category }}</dd>
        </div>
        <div>
          <dt>{{ t('周期') }}</dt>
          <dd>{{ recurrenceLabel(service.intervalValue, service.intervalUnit) }}</dd>
        </div>
        <div>
          <dt>{{ t('提醒') }}</dt>
          <dd>{{ t('reminder.daysBefore', { days: service.reminderDays.join(', ') || t('当天'), timeZone: service.timeZone }) }}</dd>
        </div>
        <div v-if="service.accountHint">
          <dt>{{ t('账号提示') }}</dt>
          <dd>{{ service.accountHint }}</dd>
        </div>
        <div v-if="service.websiteUrl">
          <dt>{{ t('官网') }}</dt>
          <dd>
            <a
              :href="service.websiteUrl"
              target="_blank"
              rel="noopener noreferrer"
            >{{ t('安全打开 ↗') }}</a>
          </dd>
        </div>
        <div v-if="service.note">
          <dt>{{ t('备注') }}</dt>
          <dd class="preserve-text">
            {{ service.note }}
          </dd>
        </div>
      </dl>
      <button
        class="setting-action"
        type="button"
        @click="exportCalendar"
      >
        {{ t('导出此服务日历') }} <span>→</span>
      </button>
      <p class="calendar-note">
        {{ t('日期改变后需要重新导出；导入前请检查旧事件。') }}
      </p>
    </section>
    <section class="detail-section">
      <div class="section-heading">
        <h2>{{ t('历史记录') }}</h2>
        <span>{{ t('count.records', { count: history.length }) }}</span>
      </div>
      <ol
        v-if="history.length"
        class="history-list"
      >
        <li
          v-for="record in history"
          :key="record.id"
        >
          <span :class="record.status">{{ record.status === 'paid' ? t('已支付') : t('已跳过') }}</span>
          <div>
            <strong>{{ record.dueDate }}</strong><small>{{ formatLocalizedDateTime(record.completedAt) }}</small>
          </div>
          <CurrencyAmount
            :amount-minor="record.amountMinor"
            :currency="record.currency"
          />
        </li>
      </ol>
      <p
        v-else
        class="muted"
      >
        {{ t('还没有付款或跳过记录。') }}
      </p>
    </section>
    <section class="detail-section danger-zone">
      <h2>{{ t('状态与数据') }}</h2>
      <button
        type="button"
        @click="toggleStatus('pause')"
      >
        {{ service.status === 'paused' ? t('恢复使用') : t('暂停服务') }}
      </button><button
        type="button"
        @click="toggleStatus('cancel')"
      >
        {{ service.status === 'cancelled' ? t('恢复服务') : t('标记为已取消（保留记录）') }}
      </button><button
        class="danger-text"
        type="button"
        @click="dialog = 'delete'"
      >
        {{ t('永久删除服务') }}
      </button>
    </section>
  </section>
  <section
    v-else-if="store.ready"
    class="page"
  >
    <h1>{{ t('未找到服务') }}</h1>
    <RouterLink
      class="button primary"
      to="/services"
    >
      {{ t('返回列表') }}
    </RouterLink>
  </section>
  <ConfirmSheet
    :open="dialog === 'paid'"
    :title="t('确认本期已支付？')"
    :confirm-label="t('确认已支付')"
    @close="dialog = null"
    @confirm="paid"
  >
    <p>{{ t('将保存本次付款历史，并推进到下一个续费日期。') }}</p>
  </ConfirmSheet>
  <ConfirmSheet
    :open="dialog === 'delete'"
    :title="t('永久删除此服务？')"
    :confirm-label="t('永久删除')"
    danger
    @close="dialog = null"
    @confirm="remove"
  >
    <p>{{ t('历史付款和跳过记录也将删除，且无法恢复。如仅需停止追踪，请标记为已取消并保留记录。') }}</p>
  </ConfirmSheet>
</template>
