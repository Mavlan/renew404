import { describe, expect, it } from 'vitest'

describe('project setup', () => {
  it('runs the test environment', () => {
    expect(indexedDB).toBeDefined()
  })
})
