<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { useI18n } from '../i18n'
import { watchForPwaUpdates } from '../services/pwaUpdates'

const { t } = useI18n()
const REMIND_LATER_MS = 30 * 60 * 1000
const SLOW_UPDATE_MS = 2_500
const FALLBACK_RELOAD_MS = 12_000
let stopUpdateChecks: (() => void) | undefined
let reminderTimer: number | undefined
let slowTimer: number | undefined
let fallbackReloadTimer: number | undefined
const updating = ref(false)
const updateSlow = ref(false)
const updateFailed = ref(false)

const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(_url, registration) {
    stopUpdateChecks?.()
    if (registration) stopUpdateChecks = watchForPwaUpdates(registration)
  },
})

function remindLater() {
  needRefresh.value = false
  window.clearTimeout(reminderTimer)
  reminderTimer = window.setTimeout(() => {
    needRefresh.value = true
  }, REMIND_LATER_MS)
}

async function installUpdate() {
  if (updating.value) return
  updating.value = true
  updateSlow.value = false
  updateFailed.value = false
  slowTimer = window.setTimeout(() => {
    updateSlow.value = true
  }, SLOW_UPDATE_MS)
  fallbackReloadTimer = window.setTimeout(() => window.location.reload(), FALLBACK_RELOAD_MS)
  try {
    await updateServiceWorker(true)
  } catch {
    window.clearTimeout(slowTimer)
    window.clearTimeout(fallbackReloadTimer)
    updating.value = false
    updateFailed.value = true
  }
}

onUnmounted(() => {
  stopUpdateChecks?.()
  window.clearTimeout(reminderTimer)
  window.clearTimeout(slowTimer)
  window.clearTimeout(fallbackReloadTimer)
})
</script>

<template>
  <div
    v-if="needRefresh"
    class="update-banner"
    :class="{ 'is-updating': updating }"
    role="status"
    aria-live="polite"
    :aria-busy="updating"
  >
    <span v-if="updateFailed">{{ t('更新未完成，请重试') }}</span>
    <span v-else-if="updateSlow">{{ t('正在完成更新，请稍候…') }}</span>
    <span v-else-if="updating">{{ t('正在应用新版本…') }}</span>
    <span v-else>{{ t('发现新版本，点击刷新') }}</span>
    <button
      type="button"
      :disabled="updating"
      @click="installUpdate"
    >
      <i
        v-if="updating"
        class="update-spinner"
        aria-hidden="true"
      />
      {{ updating ? t('正在更新…') : t('刷新') }}
    </button>
    <button
      v-if="!updating"
      type="button"
      :aria-label="t('关闭提示')"
      @click="remindLater"
    >
      ×
    </button>
  </div>
</template>
