<script setup lang="ts">
import type { A11yPreferences } from '#shared/types'

const { loading, start, stop } = useLoader()
const nuxtApp = useNuxtApp()
nuxtApp.hook('page:start', () => {
    if (!loading.value) start()
})
nuxtApp.hook('page:finish', stop)

// Apply a11y preferences on mount
const a11yPrefs = useState<A11yPreferences>('a11y', () => ({
    fontSize: 'default',
    highContrast: false,
    reducedMotion: false,
}))

onMounted(() => {
    const saved = localStorage.getItem('a11y-preferences')
    if (saved) {
        try {
            const parsed = JSON.parse(saved) satisfies A11yPreferences
            a11yPrefs.value = parsed
            applyA11yPrefs(parsed)
        } catch {
            // ignore
        }
    }
})

function applyA11yPrefs(prefs: A11yPreferences) {
    const html = document.documentElement
    const scale = prefs.fontSize === 'default' ? 1 : prefs.fontSize === 'large' ? 1.15 : 1.3
    html.style.setProperty('--a11y-font-scale', String(scale))
    html.classList.toggle('high-contrast', prefs.highContrast)
    html.classList.toggle('reduced-motion', prefs.reducedMotion)
}

watch(a11yPrefs, (prefs) => applyA11yPrefs(prefs), { deep: true })
</script>

<template>
    <div class="min-h-screen bg-[#F5F5F5]">
        <AppHeader />
        <main id="main-content" class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" tabindex="-1">
            <slot />
        </main>
        <PartComparison />
        <A11yWidget />
    </div>
</template>
