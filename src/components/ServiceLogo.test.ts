import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ServiceLogo from './ServiceLogo.vue'

const category = { iconKey: 'sparkles' as const, color: '#ff5a00' }

describe('ServiceLogo', () => {
  it('renders a locally bundled ChatGPT logo', () => {
    const wrapper = mount(ServiceLogo, { props: { iconKey: 'chatgpt', name: 'ChatGPT', category } })
    expect(wrapper.get('[data-testid="brand-logo"]').attributes('src')).toMatch(/^(data:image\/svg\+xml|\/src\/assets\/service-logos\/chatgpt\.svg)/)
  })

  it('renders the whitelisted NameSilo logo without a network asset', () => {
    const wrapper = mount(ServiceLogo, { props: { iconKey: 'namesilo', name: 'NameSilo', category } })
    expect(wrapper.find('svg[data-testid="brand-logo"]').exists()).toBe(true)
    expect(wrapper.get('svg path').attributes('fill')).toBe('#031B4E')
  })

  it('falls back from unknown iconKey to category icon, then to initial', () => {
    const categoryFallback = mount(ServiceLogo, { props: { iconKey: 'removed-template-logo', name: 'Legacy', category } })
    expect(categoryFallback.find('[data-testid="category-logo-fallback"]').exists()).toBe(true)
    const initialFallback = mount(ServiceLogo, { props: { iconKey: 'unknown', name: 'Legacy' } })
    expect(initialFallback.get('[data-testid="initial-logo-fallback"]').text()).toBe('L')
  })

  it('keeps its high-contrast logo surface in light and dark themes', () => {
    document.documentElement.dataset.theme = 'dark'
    const dark = mount(ServiceLogo, { props: { iconKey: 'chatgpt', name: 'ChatGPT', category } })
    expect(dark.classes()).toContain('service-logo')
    document.documentElement.dataset.theme = 'light'
    const light = mount(ServiceLogo, { props: { iconKey: 'chatgpt', name: 'ChatGPT', category } })
    expect(light.find('[data-testid="brand-logo"]').exists()).toBe(true)
  })
})
