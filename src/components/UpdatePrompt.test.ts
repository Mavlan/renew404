import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { setLocale } from '../i18n'
import UpdatePrompt from './UpdatePrompt.vue'

const swMock = vi.hoisted(() => ({
  needRefresh: { __v_isRef: true, value: true },
  updateServiceWorker: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('virtual:pwa-register/vue', () => ({
  useRegisterSW: () => swMock,
}))

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
  swMock.needRefresh.value = true
  setLocale('zh-CN')
})

describe('UpdatePrompt', () => {
  it('shows immediate progress and prevents repeated refresh clicks', async () => {
    vi.useFakeTimers()
    const wrapper = mount(UpdatePrompt)
    const refresh = wrapper.get('button')

    await refresh.trigger('click')
    expect(swMock.updateServiceWorker).toHaveBeenCalledTimes(1)
    expect(refresh.attributes()).toHaveProperty('disabled')
    expect(wrapper.find('.update-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('正在应用新版本…')
    expect(wrapper.findAll('button')).toHaveLength(1)

    await refresh.trigger('click')
    expect(swMock.updateServiceWorker).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('explains when worker activation is taking longer', async () => {
    vi.useFakeTimers()
    const wrapper = mount(UpdatePrompt)
    await wrapper.get('button').trigger('click')
    await vi.advanceTimersByTimeAsync(2_500)
    expect(wrapper.text()).toContain('正在完成更新，请稍候…')
    wrapper.unmount()
  })
})
