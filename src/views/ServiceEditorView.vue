<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ChevronDown, LayoutTemplate, Palette } from '@lucide/vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../app/store'
import CategorySelect from '../components/CategorySelect.vue'
import CurrencySelect from '../components/CurrencySelect.vue'
import ServiceLogo from '../components/ServiceLogo.vue'
import TemplatePickerSheet from '../components/TemplatePickerSheet.vue'
import {
  type BillingUnit,
  type CurrencyCode,
  type SubscriptionService,
} from '../domain/models'
import { categoryByName } from '../data/categories'
import {
  SERVICE_TEMPLATES,
  templateServiceDefaults,
  type ServiceTemplate,
} from '../data/serviceTemplates'
import { minorToInput, parseAmountToMinor } from '../domain/money'
import { createRecurrenceAnchor, recurrenceLabel } from '../domain/recurrence'
import { formatChineseDate } from '../services/time'
import { localizedCategoryName, useI18n } from '../i18n'

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const isEdit = computed(() => Boolean(route.params.id))
const error = ref('')
const saving = ref(false)
const pickerOpen = ref(false)
const selectedTemplateId = ref('')
const form = reactive({
  name: '',
  categoryId: 'other',
  amount: '',
  currency: 'CNY' as CurrencyCode,
  customCurrencyLabel: '',
  intervalValue: 1,
  intervalUnit: 'month' as BillingUnit,
  nextRenewalDate: '',
  renewalTime: '09:00',
  timeZone: 'Asia/Shanghai',
  reminderDays: '7, 3, 1, 0',
  iconMode: 'initial' as 'logo' | 'initial' | 'emoji',
  iconKey: '',
  iconValue: '',
  color: '#ed4f00',
  websiteUrl: '',
  accountHint: '',
  note: '',
})

const existing = computed(() => store.services.find((item) => item.id === route.params.id))
const selectedTemplate = computed(() =>
  SERVICE_TEMPLATES.find((item) => item.id === selectedTemplateId.value),
)
const selectedCategory = computed(() =>
  store.categories.find((item) => item.id === form.categoryId),
)
const displayIconKey = computed(() => (form.iconMode === 'logo' ? form.iconKey : undefined))

watch(
  [() => store.ready, existing],
  () => {
    if (!isEdit.value) {
      form.currency = store.settings?.defaultCurrency || 'CNY'
      form.timeZone = store.settings?.defaultTimeZone || 'Asia/Shanghai'
      form.reminderDays = (store.settings?.defaultReminderDays || [7, 3, 1, 0]).join(', ')
    }
    if (!existing.value) return
    const item = existing.value
    Object.assign(form, {
      name: item.name,
      categoryId: item.categoryId || categoryByName(item.category)?.id || 'other',
      amount: minorToInput(item.amountMinor, item.currency),
      currency: item.currency,
      customCurrencyLabel: item.customCurrencyLabel || '',
      intervalValue: item.intervalValue,
      intervalUnit: item.intervalUnit,
      nextRenewalDate: item.nextRenewalDate,
      renewalTime: item.renewalTime || '09:00',
      timeZone: item.timeZone,
      reminderDays: item.reminderDays.join(', '),
      iconMode: item.iconKey ? 'logo' : item.iconType,
      iconKey: item.iconKey || '',
      iconValue: item.iconValue || '',
      color: item.color,
      websiteUrl: item.websiteUrl || '',
      accountHint: item.accountHint || '',
      note: item.note || '',
    })
  },
  { immediate: true },
)

const preview = computed(() =>
  form.nextRenewalDate
    ? t('preview.schedule', { date: formatChineseDate(form.nextRenewalDate), time: form.renewalTime || '09:00', recurrence: recurrenceLabel(Number(form.intervalValue) || 1, form.intervalUnit) })
    : t('填写日期后显示续费预览。'),
)

function applyTemplate(item: ServiceTemplate) {
  Object.assign(form, templateServiceDefaults(item), { iconMode: 'logo' })
  selectedTemplateId.value = item.id
  pickerOpen.value = false
}

async function createCategory(name: string) {
  const category = await store.createCategory(name)
  form.categoryId = category.id
}

async function submit() {
  error.value = ''
  try {
    if (!form.name.trim()) throw new Error(t('请填写服务名称'))
    if (!form.amount.trim()) throw new Error(t('请填写金额'))
    if (!form.nextRenewalDate) throw new Error(t('请选择下一次续费日期'))
    if (
      !Number.isInteger(Number(form.intervalValue)) ||
      Number(form.intervalValue) < 1 ||
      Number(form.intervalValue) > 999
    )
      throw new Error(t('周期必须是 1 到 999 的整数'))
    const reminders = [
      ...new Set(
        form.reminderDays
          .split(/[,，\s]+/)
          .filter(Boolean)
          .map(Number),
      ),
    ]
    if (reminders.some((value) => !Number.isInteger(value) || value < 0 || value > 365))
      throw new Error(t('提醒天数必须是 0 到 365 的整数'))
    if (form.websiteUrl && !/^https?:\/\//i.test(form.websiteUrl))
      throw new Error(t('官网链接必须以 http:// 或 https:// 开头'))
    const category =
      store.categories.find((item) => item.id === form.categoryId) ||
      store.categories.find((item) => item.id === 'other')
    if (!category) throw new Error(t('请选择分类'))
    const now = new Date().toISOString()
    const prior = existing.value
    const service: SubscriptionService = {
      id: prior?.id || crypto.randomUUID(),
      name: form.name.trim(),
      category: category.name,
      categoryId: category.id,
      amountMinor: parseAmountToMinor(form.amount, form.currency),
      currency: form.currency,
      customCurrencyLabel: form.currency === 'OTHER' ? form.customCurrencyLabel.trim() : undefined,
      intervalValue: Number(form.intervalValue),
      intervalUnit: form.intervalUnit,
      nextRenewalDate: form.nextRenewalDate,
      renewalTime: form.renewalTime || '09:00',
      timeZone: form.timeZone,
      reminderDays: reminders.sort((a, b) => b - a),
      status: prior?.status || 'active',
      color: form.color,
      iconType: form.iconMode === 'emoji' ? 'emoji' : 'initial',
      iconKey: form.iconMode === 'logo' ? form.iconKey || undefined : undefined,
      iconValue: form.iconMode === 'logo' ? undefined : form.iconValue.trim() || undefined,
      websiteUrl: form.websiteUrl.trim() || undefined,
      accountHint: form.accountHint.trim() || undefined,
      note: form.note.trim() || undefined,
      recurrenceAnchor: createRecurrenceAnchor(form.nextRenewalDate),
      createdAt: prior?.createdAt || now,
      updatedAt: now,
    }
    saving.value = true
    await store.saveService(service)
    if (store.settings && !store.settings.onboardingComplete)
      await store.saveSettings({ ...store.settings, onboardingComplete: true })
    await router.push(`/services/${service.id}`)
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : t('保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="page editor-page">
    <header class="editor-header">
      <button
        class="back-button"
        type="button"
        :aria-label="t('返回')"
        @click="router.back()"
      >
        ←
      </button>
      <div>
        <p class="eyebrow">
          {{ isEdit ? 'EDIT ENTRY' : 'NEW ENTRY' }}
        </p>
        <h1>{{ isEdit ? t('编辑服务') : t('添加服务') }}</h1>
      </div>
    </header>
    <form
      class="editor-form"
      @submit.prevent="submit"
    >
      <section class="template-launcher">
        <div>
          <p class="eyebrow">
            SERVICE TEMPLATE
          </p>
          <h2>{{ t('选择常用服务（可选）') }}</h2>
          <p>{{ t('快速带入公开信息，价格、日期和账号仍由你填写。') }}</p>
        </div>
        <button
          class="button template-launcher__button"
          type="button"
          @click="pickerOpen = true"
        >
          <LayoutTemplate :size="19" />{{ selectedTemplate ? t('更换服务') : t('打开服务库') }}
        </button>
        <div
          v-if="selectedTemplate"
          class="selected-template-preview"
          data-testid="selected-template-preview"
        >
          <ServiceLogo
            :icon-key="displayIconKey"
            :name="form.name"
            :color="form.color"
            :category="selectedCategory"
            size="lg"
          />
          <span><small>{{ t('已应用模板') }}</small><strong>{{ form.name }}</strong><em>{{ localizedCategoryName(selectedCategory) }}</em></span>
          <i
            :style="{ background: form.color }"
            :title="`${t('品牌色')} ${form.color}`"
          />
        </div>
      </section>

      <section class="form-section">
        <h2>{{ t('基本信息') }}</h2>
        <div class="field-grid">
          <label class="field span-2"><span>{{ t('名称 *') }}</span><input
            v-model="form.name"
            required
            maxlength="80"
            autocomplete="off"
            :placeholder="t('例如 ChatGPT Plus')"
          ></label>
          <label class="field span-2"><span>{{ t('分类') }}</span><CategorySelect
            v-model="form.categoryId"
            :categories="store.categories"
            @create="createCategory"
          /></label>
          <label class="field"><span>{{ t('金额 *') }}</span><input
            v-model="form.amount"
            required
            inputmode="decimal"
            placeholder="0.00"
          ></label>
          <label class="field"><span>{{ t('货币') }}</span><CurrencySelect v-model="form.currency" /></label>
          <label
            v-if="form.currency === 'OTHER'"
            class="field span-2"
          ><span>{{ t('自定义货币符号') }}</span><input
            v-model="form.customCurrencyLabel"
            maxlength="8"
            :placeholder="t('例如 ₿')"
          ></label>
          <label class="field span-2"><span>{{ t('官网链接') }}</span><input
            v-model="form.websiteUrl"
            type="url"
            inputmode="url"
            placeholder="https://"
          ></label>
        </div>
      </section>

      <section class="form-section">
        <h2>{{ t('续费计划') }}</h2>
        <div class="field-grid">
          <label class="field"><span>{{ t('每') }}</span><input
            v-model.number="form.intervalValue"
            type="number"
            min="1"
            max="999"
            required
          ></label>
          <label class="field"><span>{{ t('周期单位') }}</span><select v-model="form.intervalUnit">
            <option value="day">{{ t('天') }}</option>
            <option value="week">{{ t('周') }}</option>
            <option value="month">{{ t('个月') }}</option>
            <option value="year">{{ t('年') }}</option>
          </select></label>
          <label class="field span-2"><span>{{ t('下一次续费日期 *') }}</span><input
            v-model="form.nextRenewalDate"
            type="date"
            required
          ></label>
          <label class="field"><span>{{ t('提醒时间') }}</span><input
            v-model="form.renewalTime"
            type="time"
          ></label>
          <label class="field"><span>{{ t('时区') }}</span><input
            v-model="form.timeZone"
            required
          ></label>
          <label class="field span-2"><span>{{ t('提前提醒天数') }}</span><input
            v-model="form.reminderDays"
            inputmode="numeric"
            placeholder="7, 3, 1, 0"
          ><small>{{ t('用逗号分隔；0 表示当天。') }}</small></label>
        </div>
        <p class="preview-line">
          <b>{{ t('计划预览') }}</b>{{ preview }}<small>{{ t('此时间仅用于提醒，不一定等于实际扣费时间。') }}</small>
        </p>
      </section>

      <section class="form-section">
        <h2>{{ t('账号与备注') }}</h2>
        <div class="field-grid">
          <label class="field span-2"><span>{{ t('账号提示') }}</span><input
            v-model="form.accountHint"
            maxlength="100"
            :placeholder="t('例如 a***@mail.com')"
          ><small>{{ t('只填写脱敏信息。') }}</small></label>
          <label class="field span-2"><span>{{ t('备注') }}</span><textarea
            v-model="form.note"
            rows="4"
            maxlength="1000"
          />
          </label>
        </div>
        <p class="privacy-warning">
          {{ t('不要填写密码、银行卡号、CVV 或其他敏感凭证。') }}
        </p>
      </section>

      <details class="advanced-section">
        <summary>
          <span><Palette :size="18" />{{ t('高级自定义') }}</span><ChevronDown :size="18" />
        </summary>
        <div class="field-grid advanced-section__body">
          <label class="field"><span>{{ t('图标') }}</span><select v-model="form.iconMode">
            <option
              v-if="form.iconKey"
              value="logo"
            >{{ t('品牌 Logo') }}</option>
            <option value="initial">{{ t('名称首字母') }}</option>
            <option value="emoji">Emoji</option>
          </select></label>
          <label
            v-if="form.iconMode !== 'logo'"
            class="field"
          ><span>{{ form.iconMode === 'emoji' ? 'Emoji' : t('自定义文字（可选）') }}</span><input
            v-model="form.iconValue"
            maxlength="8"
          ></label>
          <label class="field span-2 color-field"><span>{{ t('强调色') }}</span><input
            v-model="form.color"
            type="color"
          ></label>
        </div>
      </details>

      <p
        v-if="error"
        class="form-error"
        role="alert"
      >
        {{ error }}
      </p>
      <button
        class="button primary wide sticky-save"
        type="submit"
        :disabled="saving"
      >
        {{ saving ? t('正在保存…') : t('保存服务') }}
      </button>
    </form>
    <TemplatePickerSheet
      :open="pickerOpen"
      :categories="store.categories"
      @close="pickerOpen = false"
      @select="applyTemplate"
    />
  </section>
</template>
