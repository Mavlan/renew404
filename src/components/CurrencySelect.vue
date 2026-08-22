<script setup lang="ts">
import { computed } from 'vue'
import type { CurrencyCode } from '../domain/models'
import {
  COMMON_CURRENCY_CODES,
  CURRENCY_CODES,
  currencyOptionLabel,
} from '../data/currencies'
import { useI18n } from '../i18n'

const props = defineProps<{ modelValue: CurrencyCode; ariaLabel?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: CurrencyCode] }>()
const { locale } = useI18n()

const common = COMMON_CURRENCY_CODES
const worldwide = CURRENCY_CODES.filter(
  (code) => code !== 'OTHER' && !(COMMON_CURRENCY_CODES as readonly CurrencyCode[]).includes(code),
)
const groupLabels = computed(() => {
  const labels = {
    'zh-CN': ['常用货币', '全球货币'],
    'zh-TW': ['常用幣別', '全球幣別'],
    en: ['Common currencies', 'Worldwide currencies'],
    ja: ['よく使う通貨', '世界の通貨'],
  }
  return labels[locale.value]
})

function update(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value as CurrencyCode)
}
</script>

<template>
  <select
    class="currency-select"
    :value="props.modelValue"
    :aria-label="props.ariaLabel"
    @change="update"
  >
    <optgroup :label="groupLabels[0]">
      <option
        v-for="code in common"
        :key="code"
        :value="code"
      >
        {{ currencyOptionLabel(code, locale) }}
      </option>
    </optgroup>
    <optgroup :label="groupLabels[1]">
      <option
        v-for="code in worldwide"
        :key="code"
        :value="code"
      >
        {{ currencyOptionLabel(code, locale) }}
      </option>
    </optgroup>
    <option value="OTHER">
      {{ currencyOptionLabel('OTHER', locale) }}
    </option>
  </select>
</template>

<style scoped>
.currency-select {
  width: 100%;
  min-width: 0;
}
</style>
