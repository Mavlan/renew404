<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ServiceCategory } from '../domain/models'
import { localizedCategoryName, useI18n } from '../i18n'
import CategoryIcon from './CategoryIcon.vue'

const props = defineProps<{ modelValue: string; categories: ServiceCategory[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; create: [name: string] }>()
const creating = ref(false)
const customName = ref('')
const { t } = useI18n()
const selectedCategory = computed(() => props.categories.find((item) => item.id === props.modelValue))

function change(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === '__new__') {
    creating.value = true
    return
  }
  creating.value = false
  emit('update:modelValue', value)
}

function create() {
  const name = customName.value.trim()
  if (!name) return
  emit('create', name)
  customName.value = ''
  creating.value = false
}
</script>

<template>
  <div class="category-select">
    <select
      :value="modelValue"
      :aria-label="t('分类')"
      @change="change"
    >
      <option
        v-for="item in props.categories"
        :key="item.id"
        :value="item.id"
      >
        {{ localizedCategoryName(item) }}{{ item.isSystem ? '' : ` · ${t('自定义')}` }}
      </option>
      <option value="__new__">
        ＋ {{ t('新建自定义分类') }}
      </option>
    </select>
    <div
      v-if="creating"
      class="category-create"
      data-testid="category-create"
    >
      <input
        v-model="customName"
        maxlength="40"
        autocomplete="off"
        :placeholder="t('输入分类名称')"
        @keyup.enter.prevent="create"
      >
      <button
        class="button primary"
        type="button"
        @click="create"
      >
        {{ t('创建') }}
      </button>
    </div>
    <div
      v-else-if="selectedCategory"
      class="category-current"
    >
      <CategoryIcon :icon-key="selectedCategory?.iconKey" />
      <span>{{ localizedCategoryName(selectedCategory) }}</span>
    </div>
  </div>
</template>
