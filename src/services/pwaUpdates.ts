export const PWA_UPDATE_INTERVAL_MS = 60_000
export const PWA_INITIAL_UPDATE_DELAY_MS = 1_500

type UpdateRegistration = Pick<ServiceWorkerRegistration, 'update'>

/** Keep installed PWAs checking for a waiting worker while they remain open. */
export function watchForPwaUpdates(
  registration: UpdateRegistration,
  intervalMs = PWA_UPDATE_INTERVAL_MS,
): () => void {
  let checking = false
  let stopped = false

  const check = async () => {
    if (stopped || checking || navigator.onLine === false) return
    checking = true
    try {
      await registration.update()
    } catch {
      // A temporary network failure must not interrupt future update checks.
    } finally {
      checking = false
    }
  }

  const checkWhenVisible = () => {
    if (document.visibilityState === 'visible') void check()
  }

  const initialTimer = window.setTimeout(() => void check(), PWA_INITIAL_UPDATE_DELAY_MS)
  const intervalTimer = window.setInterval(() => void check(), intervalMs)
  document.addEventListener('visibilitychange', checkWhenVisible)
  window.addEventListener('focus', checkWhenVisible)
  window.addEventListener('pageshow', checkWhenVisible)
  window.addEventListener('online', checkWhenVisible)

  return () => {
    stopped = true
    window.clearTimeout(initialTimer)
    window.clearInterval(intervalTimer)
    document.removeEventListener('visibilitychange', checkWhenVisible)
    window.removeEventListener('focus', checkWhenVisible)
    window.removeEventListener('pageshow', checkWhenVisible)
    window.removeEventListener('online', checkWhenVisible)
  }
}
