<script setup lang="ts">
import { computed } from 'vue'
import type { CurrencyCode } from '../domain/models'
import { formatCurrency } from '../domain/money'

const props = defineProps<{ amountMinor: number; currency: CurrencyCode; customLabel?: string }>()
const label = computed(() => formatCurrency(props.amountMinor, props.currency, props.customLabel))
</script>

<template><span class="currency-amount">{{ label }}</span></template>
