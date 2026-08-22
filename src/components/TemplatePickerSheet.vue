<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { X, Search } from '@lucide/vue'
import type { ServiceCategory } from '../domain/models'
import { searchServiceTemplates, type ServiceTemplate } from '../data/serviceTemplates'
import ServiceLogo from './ServiceLogo.vue'
import { localizedCategoryName, localizedTemplateName, useI18n } from '../i18n'

const props = defineProps<{ open: boolean; categories: ServiceCategory[] }>()
const emit = defineEmits<{ close: []; select: [template: ServiceTemplate] }>()
const query = ref('')
const categoryId = ref('')
const { t } = useI18n()
const visibleCategories = computed(() =>
  props.categories.filter((category) => searchServiceTemplates('', category.id).length > 0),
)
const results = computed(() => searchServiceTemplates(query.value, categoryId.value || undefined))
const category = (id: string) => props.categories.find((item) => item.id === id)
let previousBodyOverflow = ''

function restoreBodyScroll() {
  document.body.style.overflow = previousBodyOverflow
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = ''
      categoryId.value = ''
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else {
      restoreBodyScroll()
    }
  },
)

onBeforeUnmount(restoreBodyScroll)
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
          class="template-sheet"
          role="dialog"
          aria-modal="true"
          aria-labelledby="template-title"
        >
          <header class="template-sheet__header">
            <div>
              <p class="eyebrow">
                QUICK START
              </p>
              <h2 id="template-title">
                {{ t('选择常用服务') }}
              </h2>
            </div>
            <button
              class="icon-button"
              type="button"
              :aria-label="t('关闭服务选择器')"
              @click="emit('close')"
            >
              <X :size="20" />
            </button>
          </header>
          <label class="template-search">
            <Search
              :size="18"
              aria-hidden="true"
            />
            <span class="sr-only">{{ t('搜索常用服务') }}</span>
            <input
              v-model="query"
              type="search"
              :placeholder="t('搜索英文、中文或常见别名')"
            >
          </label>
          <div
            class="template-categories"
            role="list"
            :aria-label="t('按分类筛选')"
          >
            <button
              type="button"
              :class="{ active: !categoryId }"
              @click="categoryId = ''"
            >
              {{ t('全部') }}
            </button>
            <button
              v-for="item in visibleCategories"
              :key="item.id"
              type="button"
              :class="{ active: categoryId === item.id }"
              @click="categoryId = item.id"
            >
              {{ localizedCategoryName(item) }}
            </button>
          </div>
          <div class="template-results">
            <button
              v-for="item in results"
              :key="item.id"
              class="template-option"
              type="button"
              @click="emit('select', item)"
            >
              <ServiceLogo
                :icon-key="item.iconKey"
                :name="localizedTemplateName(item.id, item.name)"
                :color="item.brandColor"
                :category="category(item.categoryId)"
              />
              <span><strong>{{ localizedTemplateName(item.id, item.name) }}</strong><small>{{ localizedCategoryName(category(item.categoryId)) }}</small></span>
              <span class="template-option__arrow">→</span>
            </button>
            <p
              v-if="!results.length"
              class="template-empty"
            >
              {{ t('没有匹配的模板。你仍可关闭面板后完全自定义。') }}
            </p>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
