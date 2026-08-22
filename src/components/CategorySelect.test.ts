import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createSystemCategories } from '../data/categories'
import CategorySelect from './CategorySelect.vue'

describe('CategorySelect', () => {
  it('lists all system categories and offers custom category creation last', async () => {
    const categories = createSystemCategories('2026-08-22T00:00:00.000Z')
    const wrapper = mount(CategorySelect, { props: { modelValue: 'other', categories } })
    const options = wrapper.findAll('option')
    expect(options).toHaveLength(18)
    expect(options.at(-1)?.text()).toContain('新建自定义分类')

    await wrapper.get('select').setValue('__new__')
    await wrapper.get('[data-testid="category-create"] input').setValue('宠物服务')
    await wrapper.get('[data-testid="category-create"] button').trigger('click')
    expect(wrapper.emitted('create')?.[0]).toEqual(['宠物服务'])
  })
})
