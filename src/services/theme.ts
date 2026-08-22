import type { AppSettings } from '../domain/models'

export function applyTheme(theme: AppSettings['theme']) {
  if (theme === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.dataset.theme = theme
}
