import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { setLocale } from '../i18n'
import CurrencySelect from './CurrencySelect.vue'

afterEach(() => setLocale('zh-CN'))

describe('CurrencySelect', () => {
  it('puts common currencies first and shows flags with localized names', () => {
    setLocale('en')
    const wrapper = mount(CurrencySelect, { props: { modelValue: 'CNY' } })
    const groups = wrapper.findAll('optgroup')
    expect(groups[0].attributes('label')).toBe('Common currencies')
    expect(groups[1].attributes('label')).toBe('Worldwide currencies')
    expect(wrapper.get('option[value="CNY"]').text()).toMatch(/^🇨🇳 CNY · /)
    expect(wrapper.get('option[value="AED"]').text()).toMatch(/^🇦🇪 AED · /)
  })

  it('emits a worldwide currency code without changing its stored value', async () => {
    const wrapper = mount(CurrencySelect, { props: { modelValue: 'USD' } })
    await wrapper.get('select').setValue('BHD')
    expect(wrapper.emitted('update:modelValue')).toEqual([['BHD']])
  })
})
