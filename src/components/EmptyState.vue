<script setup lang="ts">
defineProps<{ code?: string; title: string; description: string }>()
</script>

<template>
  <div class="empty-state">
    <span
      class="empty-code"
      aria-hidden="true"
    >{{ code || '404' }}</span>
    <h2>{{ title }}</h2>
    <p class="muted">
      {{ description }}
    </p>
    <slot />
  </div>
</template>
