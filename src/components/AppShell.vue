<script setup lang="ts">
import BottomNav from './BottomNav.vue'
import UpdatePrompt from './UpdatePrompt.vue'
import { useI18n } from '../i18n'
const { t } = useI18n()
</script>

<template>
  <div class="app-shell">
    <a
      class="app-skip"
      href="#main-content"
    >{{ t('app.skip') }}</a>
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
