<script setup lang="ts">
import DemoPreview from '../components/DemoPreview.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { useI18n } from '../i18n'
const { t } = useI18n()
</script>
<template>
  <main class="demo-page">
    <header class="demo-page-header">
      <RouterLink to="/">
        Renew404
      </RouterLink><LanguageSwitcher />
    </header>
    <h1>{{ t('demo.title') }}</h1>
    <DemoPreview />
    <div class="demo-page-actions">
      <RouterLink
        class="button primary"
        to="/services/new"
      >
        {{ t('demo.start') }}
      </RouterLink><RouterLink
        class="text-link"
        to="/"
      >
        {{ t('demo.return') }}
      </RouterLink>
    </div>
  </main>
</template>
