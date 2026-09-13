<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAppStore } from '../app/store'
import EmptyState from '../components/EmptyState.vue'
import RenewalCard from '../components/RenewalCard.vue'
import { localizedCategoryName, useI18n } from '../i18n'

const store = useAppStore()
const { t } = useI18n()
const query = ref('')
const status = ref('all')
const category = ref('all')
const filtered = computed(() =>
  store.services
    .filter(
      (item) =>
        item.name.toLocaleLowerCase().includes(query.value.toLocaleLowerCase()) &&
        (status.value === 'all' || item.status === status.value) &&
        (category.value === 'all' ||
          item.categoryId === category.value ||
          (!item.categoryId && item.category === category.value)),
    )
    .sort((a, b) => a.nextRenewalDate.localeCompare(b.nextRenewalDate)),
)
</script>

<template>
  <section class="page stack-xl">
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">
          SERVICE INDEX
        </p>
        <h1>{{ t('全部服务') }}</h1>
      </div>
      <RouterLink
        class="icon-button"
        to="/services/new"
        :aria-label="t('新增服务')"
      >
        ＋
      </RouterLink>
    </header>
    <div class="filter-panel">
      <label class="search-field"><span class="sr-only">{{ t('搜索服务名称') }}</span><input
        v-model="query"
        type="search"
        :placeholder="t('搜索服务名称')"
      ></label>
      <div class="filter-row">
        <label><span class="sr-only">{{ t('状态') }}</span><select v-model="status">
          <option value="all">{{ t('全部状态') }}</option>
          <option value="active">{{ t('使用中') }}</option>
          <option value="paused">{{ t('已暂停') }}</option>
          <option value="cancelled">{{ t('已取消') }}</option>
        </select></label>
        <label><span class="sr-only">{{ t('分类') }}</span><select v-model="category">
          <option value="all">{{ t('全部分类') }}</option>
          <option
            v-for="item in store.categories"
            :key="item.id"
            :value="item.id"
          >
            {{ localizedCategoryName(item) }}
          </option>
        </select></label>
      </div>
    </div>
    <div
      v-if="filtered.length"
      class="card-list"
    >
      <RenewalCard
        v-for="service in filtered"
        :key="service.id"
        :service="service"
        compact
      />
    </div>
    <EmptyState
      v-else
      :title="store.services.length ? t('没有匹配的服务') : t('empty.services')"
      :description="store.services.length ? t('调整筛选条件，或添加一项新的周期服务。') : t('empty.description')"
    >
      <RouterLink
        class="button primary"
        to="/services/new"
      >
        {{ t('新增服务') }}
      </RouterLink>
      <button
        v-if="query || status !== 'all' || category !== 'all'"
        class="button secondary"
        type="button"
        @click="query = ''; status = 'all'; category = 'all'"
      >
        {{ t('filter.reset') }}
      </button>
    </EmptyState>
  </section>
</template>
