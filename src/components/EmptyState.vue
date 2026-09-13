<script setup lang="ts">
defineProps<{ code?: string; title: string; description: string }>()
</script>

<template>
  <div class="empty-state">
    <span
      v-if="code"
      class="empty-code"
      aria-hidden="true"
    >{{ code }}</span>
    <h2>{{ title }}</h2>
    <p class="muted">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
