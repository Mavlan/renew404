<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from '../i18n'

const props = withDefaults(defineProps<{ open: boolean; title: string; confirmLabel?: string; danger?: boolean }>(), { confirmLabel: '确认', danger: false })
const emit = defineEmits<{ close: []; confirm: [] }>()
const { t } = useI18n()
const confirmButton = ref<HTMLButtonElement | null>(null)
let previousFocus: HTMLElement | null = null

watch(() => props.open, async (open) => {
  if (open) {
    previousFocus = document.activeElement as HTMLElement
    await nextTick()
    confirmButton.value?.focus()
  } else previousFocus?.focus()
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}
document.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div
        v-if="open"
        class="sheet-backdrop"
        role="presentation"
        @click.self="emit('close')"
      >
        <section
          class="confirm-sheet"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="`sheet-${title}`"
        >
          <span
            class="sheet-handle"
            aria-hidden="true"
          />
          <h2 :id="`sheet-${title}`">
            {{ title }}
          </h2>
          <div class="sheet-body">
            <slot />
          </div>
          <div class="sheet-actions">
            <button
              class="button secondary"
              type="button"
              @click="emit('close')"
            >
              {{ t('返回') }}
            </button>
            <button
              ref="confirmButton"
              class="button"
              :class="danger ? 'danger' : 'primary'"
              type="button"
              @click="emit('confirm')"
            >
              {{ t(confirmLabel) }}
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
