import type { A11yPreferences } from '#shared/types'

export default defineNuxtPlugin(() => {
  const saved = localStorage.getItem('a11y-preferences')
  if (!saved) return

  try {
    const prefs = JSON.parse(saved) as A11yPreferences
    const html = document.documentElement
    const scale = prefs.fontSize === 'default' ? 1 : prefs.fontSize === 'large' ? 1.15 : 1.3
    html.style.setProperty('--a11y-font-scale', String(scale))
    html.classList.toggle('high-contrast', prefs.highContrast)
    html.classList.toggle('reduced-motion', prefs.reducedMotion)
  } catch {
    // ignore corrupt data
  }
})
