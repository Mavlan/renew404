import { describe, expect, it } from 'vitest'
import { SERVICE_LOGOS } from './serviceLogos'
import { SERVICE_TEMPLATES } from './serviceTemplates'

const intentionalFallbacks = new Set([
  'disney-plus', 'iqiyi', 'jd', 'tencent-video',
  'generic-broadband', 'generic-domain', 'generic-mobile', 'generic-network', 'generic-vps',
])

describe('service logo whitelist', () => {
  it('maps every supported branded template to a real bundled logo', () => {
    const missing = SERVICE_TEMPLATES
      .map((template) => template.iconKey)
      .filter((key) => !SERVICE_LOGOS[key] && !intentionalFallbacks.has(key))
    expect(missing).toEqual([])
  })

  it('uses the real bundled OpenAI mark instead of the removed hand-drawn asset', () => {
    expect(SERVICE_LOGOS.chatgpt.url).toMatch(/^data:image\/svg\+xml/)
    expect(SERVICE_LOGOS.chatgpt.url).not.toContain('service-logos/chatgpt')
  })

  it('keeps icon resources local and never stores a third-party runtime URL', () => {
    for (const item of Object.values(SERVICE_LOGOS)) {
      expect(item.url || '').not.toMatch(/^https?:\/\//)
      expect(Boolean(item.path || item.url || item.icon)).toBe(true)
    }
  })
})
