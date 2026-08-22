<script setup lang="ts">
import { computed } from 'vue'
import { differenceInCalendarDaysLocal } from '../domain/recurrence'
import { todayInTimeZone } from '../services/time'
import { useI18n } from '../i18n'

const props = defineProps<{ date: string; timeZone?: string }>()
const difference = computed(() => differenceInCalendarDaysLocal(props.date, todayInTimeZone(props.timeZone)))
const { t } = useI18n()
const label = computed(() => difference.value < 0
  ? t('countdown.overdue', { days: Math.abs(difference.value) })
  : difference.value === 0 ? t('countdown.today') : t('countdown.remaining', { days: difference.value }))
const tone = computed(() => difference.value < 0 ? 'danger' : difference.value <= 3 ? 'warning' : 'neutral')
</script>

<template>
  <span
    class="countdown"
    :data-tone="tone"
  >{{ label }}</span>
</template>
