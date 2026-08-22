<script setup lang="ts">
import { computed, reactive, ref, shallowRef, watch } from 'vue'
import { useAppStore } from '../app/store'
import ConfirmSheet from '../components/ConfirmSheet.vue'
import CurrencySelect from '../components/CurrencySelect.vue'
import InstallGuide from '../components/InstallGuide.vue'
import { type AppLocale, type AppSettings, type CurrencyCode } from '../domain/models'
import { applyTheme } from '../services/theme'
import { backupFilename, createBackup, importBackup, parseBackup, type Renew404Backup } from '../services/backup'
import { calendarFilename, generateCalendar } from '../services/calendar'
import { downloadBlob, shareOrDownload } from '../services/download'
import { formatLocalizedDateTime, LOCALE_OPTIONS, setLocale, useI18n } from '../i18n'

const store = useAppStore()
const { t } = useI18n()
const appVersion = __APP_VERSION__
const message = ref('')
const clearOpen = ref(false)
const deleteText = ref('')
const importOpen = ref(false)
const pendingBackup = shallowRef<Renew404Backup | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const form = reactive({ locale: 'zh-CN' as AppLocale, theme: 'system' as AppSettings['theme'], defaultCurrency: 'CNY' as CurrencyCode, defaultTimeZone: 'Asia/Shanghai', defaultReminderDays: '7, 3, 1, 0' })
watch(() => store.settings, (settings) => { if (settings) Object.assign(form, { locale: settings.locale, theme: settings.theme, defaultCurrency: settings.defaultCurrency, defaultTimeZone: settings.defaultTimeZone, defaultReminderDays: settings.defaultReminderDays.join(', ') }) }, { immediate: true })
watch(() => form.locale, setLocale, { immediate: true })
watch(() => form.theme, applyTheme, { immediate: true })
const backupDue = computed(() => {
  if (!store.settings?.lastBackupAt) return store.services.length > 0
  return Date.now() - new Date(store.settings.lastBackupAt).getTime() > store.settings.backupReminderDays * 86_400_000
})
async function save() {
  if (!store.settings) return
  const days = [...new Set(form.defaultReminderDays.split(/[,，\s]+/).filter(Boolean).map(Number))]
  if (days.some((value) => !Number.isInteger(value) || value < 0 || value > 365)) { message.value = t('提醒天数必须是 0 到 365 的整数'); return }
  await store.saveSettings({ ...store.settings, locale: form.locale, theme: form.theme, defaultCurrency: form.defaultCurrency, defaultTimeZone: form.defaultTimeZone, defaultReminderDays: days })
  message.value = t('设置已保存在本机。')
}
async function saveLanguage() {
  await store.saveLocale(form.locale)
  message.value = t('语言已自动保存在本机。')
}
async function clearAll() { if (deleteText.value !== 'DELETE') return; await store.clearAll(); clearOpen.value = false; deleteText.value = ''; message.value = t('全部本地数据已清空。') }
async function exportJson() {
  const backup = await createBackup()
  await shareOrDownload(JSON.stringify(backup, null, 2), backupFilename(), 'application/json;charset=utf-8')
  await store.refresh(); message.value = t('备份已生成，请保存到“文件”。')
}
async function chooseImport(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try { pendingBackup.value = parseBackup(await file.text()); importOpen.value = true }
  catch (caught) { message.value = caught instanceof Error ? caught.message : t('无法读取备份') }
  finally { (event.target as HTMLInputElement).value = '' }
}
async function restore(mode: 'replace' | 'merge') {
  if (!pendingBackup.value) return
  try {
    if (mode === 'replace') {
      const safety = await createBackup()
      downloadBlob(new Blob([JSON.stringify(safety, null, 2)], { type: 'application/json;charset=utf-8' }), `renew404-before-import-${new Date().toISOString().slice(0, 10)}.json`)
    }
    await importBackup(pendingBackup.value, mode); await store.refresh(); importOpen.value = false
    message.value = mode === 'replace' ? t('已覆盖恢复；导入前备份也已下载。') : t('备份已合并。')
  } catch (caught) { message.value = caught instanceof Error ? caught.message : t('导入失败，原数据未改变。') }
}
async function exportCalendar() {
  if (!store.activeServices.length) { message.value = t('没有使用中的服务可导出。'); return }
  await shareOrDownload(generateCalendar(store.activeServices), calendarFilename(), 'text/calendar;charset=utf-8')
  message.value = t('日历已生成。重复导入前请检查或删除旧事件。')
}
</script>

<template>
  <section class="page stack-xl">
    <header>
      <p class="eyebrow">
        SYSTEM / LOCAL DATA
      </p><h1>{{ t('设置') }}</h1>
    </header>
    <form
      class="settings-stack"
      @submit.prevent="save"
    >
      <section class="settings-card">
        <h2>{{ t('偏好') }}</h2><label class="setting-row"><span><b>{{ t('语言') }}</b><small>{{ t('选择后立即切换并自动保存') }}</small></span><select
          v-model="form.locale"
          aria-label="Language"
          @change="saveLanguage"
        ><option
          v-for="item in LOCALE_OPTIONS"
          :key="item.value"
          :value="item.value"
        >{{ item.label }}</option></select></label><label class="setting-row"><span><b>{{ t('主题') }}</b><small>{{ t('跟随系统或固定显示') }}</small></span><select v-model="form.theme"><option value="system">{{ t('跟随系统') }}</option><option value="light">{{ t('浅色') }}</option><option value="dark">{{ t('深色') }}</option></select></label><label class="setting-row"><span><b>{{ t('默认货币') }}</b><small>{{ t('新服务的初始值') }}</small></span><CurrencySelect
          v-model="form.defaultCurrency"
          :aria-label="t('默认货币')"
        /></label><label class="setting-row vertical"><span><b>{{ t('默认时区') }}</b><small>{{ t('提醒时间不会随旅行自动变化') }}</small></span><input v-model="form.defaultTimeZone"></label><label class="setting-row vertical"><span><b>{{ t('默认提醒天数') }}</b><small>{{ t('逗号分隔，0 表示当天') }}</small></span><input v-model="form.defaultReminderDays"></label><button
          class="button primary"
          type="submit"
        >
          {{ t('保存偏好') }}
        </button>
      </section>
    </form>
    <section class="settings-card">
      <h2>{{ t('备份与日历') }}</h2><p
        v-if="backupDue"
        class="backup-reminder"
      >
        {{ t('已有一段时间没有备份。建议现在导出一份 JSON 并保存到“文件”。') }}
      </p><button
        class="setting-action"
        type="button"
        @click="exportJson"
      >
        {{ t('导出 JSON 备份') }} <span>→</span>
      </button><button
        class="setting-action"
        type="button"
        @click="fileInput?.click()"
      >
        {{ t('导入 JSON 备份') }} <span>→</span>
      </button><input
        ref="fileInput"
        class="sr-only"
        type="file"
        accept="application/json,.json"
        @change="chooseImport"
      ><button
        class="setting-action"
        type="button"
        @click="exportCalendar"
      >
        {{ t('导出全部日历事件') }} <span>→</span>
      </button><p class="calendar-note">
        {{ t('日历不是自动同步。建议建立专用“Renew404”日历；日期改变后请重新导出，重复导入前先检查旧事件。') }}
      </p>
    </section>
    <section class="settings-card">
      <h2>{{ t('安装与隐私') }}</h2><InstallGuide /><div class="info-block">
        <b>{{ t('数据只在本机') }}</b><p>{{ t('删除 PWA 或清除网站数据可能导致记录丢失，请定期导出备份。不收集分析、广告或位置数据。') }}</p>
      </div><div class="version-row">
        <span>{{ t('应用版本') }}</span><code>{{ appVersion }}</code>
      </div>
    </section>
    <section class="settings-card danger-zone">
      <h2>{{ t('危险操作') }}</h2><p>{{ t('清空服务、历史记录和设置。此操作无法撤销。') }}</p><button
        class="danger-text"
        type="button"
        @click="clearOpen = true"
      >
        {{ t('清空全部数据') }}
      </button>
    </section><p
      v-if="message"
      class="toast-message"
      role="status"
    >
      {{ message }}
    </p>
  </section>
  <ConfirmSheet
    :open="clearOpen"
    :title="t('清空全部本地数据？')"
    :confirm-label="t('确认清空')"
    danger
    @close="clearOpen = false"
    @confirm="clearAll"
  >
    <label class="field"><span>{{ t('输入 DELETE 以继续') }}</span><input
      v-model="deleteText"
      autocomplete="off"
    ></label>
  </ConfirmSheet>
  <ConfirmSheet
    :open="importOpen"
    :title="t('确认导入备份')"
    :confirm-label="t('合并数据')"
    @close="importOpen = false"
    @confirm="restore('merge')"
  >
    <div
      v-if="pendingBackup"
      class="import-preview"
    >
      <p>{{ t('count.servicesHistory', { services: pendingBackup.data.services.length, payments: pendingBackup.data.payments.length }) }}</p><p>{{ t('exported.at', { date: formatLocalizedDateTime(pendingBackup.exportedAt) }) }}</p><button
        class="button danger wide"
        type="button"
        @click="restore('replace')"
      >
        {{ t('覆盖现有数据') }}
      </button><small>{{ t('覆盖前会自动下载当前数据备份。合并时相同 ID 保留更新时间较新的记录。') }}</small>
    </div>
  </ConfirmSheet>
</template>
