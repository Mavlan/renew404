<script setup lang="ts">
import { computed, ref } from 'vue'
import { Languages } from '@lucide/vue'
import { useAppStore } from '../app/store'
import type { AppLocale } from '../domain/models'
import { getLocale, LOCALE_OPTIONS, useI18n } from '../i18n'

const store = useAppStore()
const { t } = useI18n()
const saving = ref(false)
const shortLabels: Record<AppLocale, string> = {
  'zh-CN': '简',
  'zh-TW': '繁',
  en: 'EN',
  ja: '日',
}
const currentLocale = computed(() => store.settings?.locale ?? getLocale())

async function changeLanguage(event: Event) {
  const locale = (event.target as HTMLSelectElement).value as AppLocale
  saving.value = true
  try {
    await store.saveLocale(locale)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <label
    class="language-switcher"
    :title="t('语言')"
  >
    <Languages
      :size="17"
      aria-hidden="true"
    />
    <span aria-hidden="true">{{ shortLabels[currentLocale] }}</span>
    <select
      :value="currentLocale"
      :aria-label="t('语言')"
      :disabled="saving"
      @change="changeLanguage"
    >
      <option
        v-for="item in LOCALE_OPTIONS"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
  </label>
</template>
