import type { A11yPreferences } from '#shared/types'

const STORAGE_KEY = 'a11y-preferences'
const DEFAULT: A11yPreferences = { fontSize: 'default', highContrast: false, reducedMotion: false }

export function useA11y() {
  const prefs = useState<A11yPreferences>('a11y', () => ({ ...DEFAULT }))

  function applyPreferences(p: A11yPreferences) {
    if (!import.meta.client) return
    const html = document.documentElement
    const scale = p.fontSize === 'default' ? 1 : p.fontSize === 'large' ? 1.15 : 1.3
    html.style.setProperty('--a11y-font-scale', String(scale))
    html.classList.toggle('high-contrast', p.highContrast)
    html.classList.toggle('reduced-motion', p.reducedMotion)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
  }

  function setFontSize(size: A11yPreferences['fontSize']) {
    prefs.value = { ...prefs.value, fontSize: size }
    applyPreferences(prefs.value)
  }

  function toggleHighContrast() {
    prefs.value = { ...prefs.value, highContrast: !prefs.value.highContrast }
    applyPreferences(prefs.value)
  }

  function toggleReducedMotion() {
    prefs.value = { ...prefs.value, reducedMotion: !prefs.value.reducedMotion }
    applyPreferences(prefs.value)
  }

  function reset() {
    prefs.value = { ...DEFAULT }
    applyPreferences(prefs.value)
  }

  return { prefs, setFontSize, toggleHighContrast, toggleReducedMotion, applyPreferences, reset }
}
