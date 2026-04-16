<script setup lang="ts">
import { Accessibility } from 'lucide-vue-next'

const { prefs, setFontSize, toggleHighContrast, toggleReducedMotion } = useA11y()

const isOpen = ref(false)
const panelRef = ref<HTMLElement | null>(null)

function open() {
    isOpen.value = true
    nextTick(() => {
        panelRef.value?.querySelector<HTMLElement>('button')?.focus()
    })
}

function close() {
    isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
}

function handleClickOutside(e: MouseEvent) {
    if (panelRef.value && !panelRef.value.contains(e.target as Node)) {
        close()
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
    <div class="fixed right-6 bottom-6 z-50">
        <button
            v-if="!isOpen"
            class="flex size-12 items-center justify-center rounded-full bg-[#1DA05E] text-white shadow-lg hover:bg-[#116037] focus-visible:ring-2 focus-visible:ring-[#1DA05E] focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Open accessibility settings"
            aria-haspopup="dialog"
            @click.stop="open"
        >
            <Accessibility class="size-6" aria-hidden="true" />
        </button>

        <div
            v-if="isOpen"
            ref="panelRef"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-widget-title"
            class="w-72 rounded-xl bg-white p-4 shadow-xl ring-1 ring-[#B5B5B5]"
            @keydown="handleKeydown"
            @click.stop
        >
            <div class="mb-3 flex items-center justify-between">
                <h2 id="a11y-widget-title" class="text-sm font-semibold text-[#1C1C1A]">
                    Accessibility
                </h2>
                <button
                    class="rounded p-1 text-[#B5B5B5] hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-[#1DA05E] focus-visible:outline-none"
                    aria-label="Close accessibility settings"
                    @click="close"
                >
                    <svg
                        class="size-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div class="mb-3">
                <p class="mb-1.5 text-xs font-medium text-[#1C1C1A]">Font size</p>
                <div class="flex gap-1" role="group" aria-label="Font size options">
                    <button
                        v-for="size in ['default', 'large', 'x-large'] as const"
                        :key="size"
                        :aria-pressed="prefs.fontSize === size"
                        :class="[
                            'flex-1 rounded px-2 py-1.5 text-xs font-medium capitalize transition',
                            prefs.fontSize === size
                                ? 'bg-[#1DA05E] text-white'
                                : 'border border-[#B5B5B5] text-[#1C1C1A] hover:border-[#1DA05E]',
                        ]"
                        @click="setFontSize(size)"
                    >
                        {{ size === 'default' ? 'A' : size === 'large' ? 'A+' : 'A++' }}
                    </button>
                </div>
            </div>

            <div class="mb-3 flex items-center justify-between">
                <label class="text-xs font-medium text-[#1C1C1A]">High contrast</label>
                <button
                    role="switch"
                    :aria-checked="prefs.highContrast"
                    :aria-label="`High contrast: ${prefs.highContrast ? 'on' : 'off'}`"
                    :class="[
                        'relative inline-flex h-5 w-9 items-center rounded-full transition',
                        prefs.highContrast ? 'bg-[#1DA05E]' : 'bg-[#B5B5B5]',
                    ]"
                    @click="toggleHighContrast"
                >
                    <span
                        :class="[
                            'inline-block size-3.5 rounded-full bg-white shadow transition',
                            prefs.highContrast ? 'translate-x-4' : 'translate-x-0.5',
                        ]"
                    />
                </button>
            </div>

            <div class="flex items-center justify-between">
                <label class="text-xs font-medium text-[#1C1C1A]">Reduced motion</label>
                <button
                    role="switch"
                    :aria-checked="prefs.reducedMotion"
                    :aria-label="`Reduced motion: ${prefs.reducedMotion ? 'on' : 'off'}`"
                    :class="[
                        'relative inline-flex h-5 w-9 items-center rounded-full transition',
                        prefs.reducedMotion ? 'bg-[#1DA05E]' : 'bg-[#B5B5B5]',
                    ]"
                    @click="toggleReducedMotion"
                >
                    <span
                        :class="[
                            'inline-block size-3.5 rounded-full bg-white shadow transition',
                            prefs.reducedMotion ? 'translate-x-4' : 'translate-x-0.5',
                        ]"
                    />
                </button>
            </div>
        </div>
    </div>
</template>
