import { afterEach, describe, expect, it, vi } from 'vitest'
import { shareOrDownload } from './download'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('shareOrDownload', () => {
  it('shares exactly one JSON file without an additional text title payload', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { canShare: vi.fn(() => true), share })

    await shareOrDownload('{"format":"renew404-backup"}', 'renew404-backup.json', 'application/json;charset=utf-8')

    expect(share).toHaveBeenCalledTimes(1)
    const payload = share.mock.calls[0]?.[0] as ShareData
    expect(Object.keys(payload)).toEqual(['files'])
    expect(payload.files).toHaveLength(1)
    expect(payload.files?.[0]).toMatchObject({ name: 'renew404-backup.json', type: 'application/json;charset=utf-8' })
  })
})
