<script setup lang="ts">
import BottomNav from './BottomNav.vue'
import UpdatePrompt from './UpdatePrompt.vue'
</script>

<template>
  <div class="app-shell">
    <main
      id="main-content"
      class="app-content"
    >
      <RouterView />
    </main>
    <BottomNav />
    <UpdatePrompt />
  </div>
</template>
