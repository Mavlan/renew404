import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  PWA_INITIAL_UPDATE_DELAY_MS,
  PWA_UPDATE_INTERVAL_MS,
  watchForPwaUpdates,
} from './pwaUpdates'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('PWA update checks', () => {
  it('checks shortly after registration and every minute while open', async () => {
    vi.useFakeTimers()
    const update = vi.fn().mockResolvedValue(undefined)
    const stop = watchForPwaUpdates({ update })

    await vi.advanceTimersByTimeAsync(PWA_INITIAL_UPDATE_DELAY_MS)
    expect(update).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(PWA_UPDATE_INTERVAL_MS)
    expect(update).toHaveBeenCalledTimes(2)
    stop()
    await vi.advanceTimersByTimeAsync(PWA_UPDATE_INTERVAL_MS)
    expect(update).toHaveBeenCalledTimes(2)
  })

  it('checks again when an installed PWA returns to the foreground', async () => {
    vi.useFakeTimers()
    const update = vi.fn().mockResolvedValue(undefined)
    const stop = watchForPwaUpdates({ update })
    await vi.advanceTimersByTimeAsync(PWA_INITIAL_UPDATE_DELAY_MS)

    window.dispatchEvent(new Event('focus'))
    await vi.runAllTicks()
    expect(update).toHaveBeenCalledTimes(2)
    stop()
  })

  it('continues checking after a temporary update failure', async () => {
    vi.useFakeTimers()
    const update = vi.fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(undefined)
    const stop = watchForPwaUpdates({ update })

    await vi.advanceTimersByTimeAsync(PWA_INITIAL_UPDATE_DELAY_MS)
    await vi.advanceTimersByTimeAsync(PWA_UPDATE_INTERVAL_MS)
    expect(update).toHaveBeenCalledTimes(2)
    stop()
  })
})
