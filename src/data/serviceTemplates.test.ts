import { describe, expect, it } from 'vitest'
import { SERVICE_TEMPLATES, searchServiceTemplates, templateServiceDefaults } from './serviceTemplates'

describe('service templates', () => {
  it('fills only public template fields for ChatGPT', () => {
    const chatgpt = SERVICE_TEMPLATES.find((item) => item.id === 'chatgpt')!
    expect(templateServiceDefaults(chatgpt)).toEqual({
      name: 'ChatGPT', categoryId: 'ai-creative', iconKey: 'chatgpt', color: '#10a37f',
      websiteUrl: 'https://chatgpt.com/', intervalValue: 1, intervalUnit: 'month',
    })
    expect(templateServiceDefaults(chatgpt)).not.toHaveProperty('amount')
    expect(templateServiceDefaults(chatgpt)).not.toHaveProperty('nextRenewalDate')
    expect(templateServiceDefaults(chatgpt)).not.toHaveProperty('accountHint')
  })

  it('searches English, Chinese aliases and category', () => {
    expect(searchServiceTemplates('OpenAI').map((item) => item.id)).toContain('chatgpt')
    expect(searchServiceTemplates('奈飞').map((item) => item.id)).toContain('netflix')
    expect(searchServiceTemplates('sufe').map((item) => item.id)).toContain('surfercloud')
    expect(searchServiceTemplates('冲浪云').map((item) => item.id)).toContain('surfercloud')
    expect(searchServiceTemplates('Extra VM').map((item) => item.id)).toContain('extravm')
    expect(searchServiceTemplates('游戏服务器').map((item) => item.id)).toContain('extravm')
    expect(searchServiceTemplates('', 'gaming').every((item) => item.categoryId === 'gaming')).toBe(true)
  })

  it('fills ExtraVM public hosting defaults without private or transaction data', () => {
    const extravm = SERVICE_TEMPLATES.find((item) => item.id === 'extravm')!
    expect(templateServiceDefaults(extravm)).toEqual({
      name: 'ExtraVM', categoryId: 'cloud-servers', iconKey: 'extravm', color: '#00c3e6',
      websiteUrl: 'https://extravm.com/', intervalValue: 1, intervalUnit: 'month',
    })
    expect(templateServiceDefaults(extravm)).not.toHaveProperty('amount')
    expect(templateServiceDefaults(extravm)).not.toHaveProperty('nextRenewalDate')
    expect(templateServiceDefaults(extravm)).not.toHaveProperty('accountHint')
  })

  it('fills SurferCloud public defaults without private or transaction data', () => {
    const surfercloud = SERVICE_TEMPLATES.find((item) => item.id === 'surfercloud')!
    expect(templateServiceDefaults(surfercloud)).toEqual({
      name: 'SurferCloud', categoryId: 'cloud-servers', iconKey: 'surfercloud', color: '#1c60f5',
      websiteUrl: 'https://www.surfercloud.com/', intervalValue: 1, intervalUnit: 'month',
    })
    expect(templateServiceDefaults(surfercloud)).not.toHaveProperty('amount')
    expect(templateServiceDefaults(surfercloud)).not.toHaveProperty('nextRenewalDate')
    expect(templateServiceDefaults(surfercloud)).not.toHaveProperty('accountHint')
  })

  it('provides a yearly NameSilo domain-renewal template', () => {
    const namesilo = SERVICE_TEMPLATES.find((item) => item.id === 'namesilo')!
    expect(searchServiceTemplates('Name Silo').map((item) => item.id)).toContain('namesilo')
    expect(templateServiceDefaults(namesilo)).toEqual({
      name: 'NameSilo', categoryId: 'domains-websites', iconKey: 'namesilo', color: '#031b4e',
      websiteUrl: 'https://www.namesilo.com/', intervalValue: 1, intervalUnit: 'year',
    })
  })
})
