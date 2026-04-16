<script setup lang="ts">
interface Props {
    open: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    size: 'md',
})

const emit = defineEmits<{
    close: []
}>()

const dialogRef = ref<HTMLElement | null>(null)
const previousFocus = ref<HTMLElement | null>(null)

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
}

watch(
    () => props.open,
    (val) => {
        if (val) {
            previousFocus.value = document.activeElement as HTMLElement
            nextTick(() => {
                const focusable = dialogRef.value?.querySelector<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                )
                focusable?.focus()
            })
        } else {
            nextTick(() => previousFocus.value?.focus())
        }
    },
)

function handleKeydown(event: KeyboardEvent) {
    if (!props.open) return

    if (event.key === 'Escape') {
        emit('close')
        return
    }

    if (event.key === 'Tab' && dialogRef.value) {
        const focusableEls = dialogRef.value.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        const first = focusableEls[0]
        const last = focusableEls[focusableEls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
        }
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="open"
                class="fixed inset-0 z-50 flex items-center justify-center p-4"
                @keydown="handleKeydown"
            >
                <div
                    aria-hidden="true"
                    class="absolute inset-0 bg-black/50"
                    @click="emit('close')"
                />

                <div
                    ref="dialogRef"
                    role="dialog"
                    aria-modal="true"
                    :aria-labelledby="title ? 'modal-title' : undefined"
                    :class="[
                        'relative z-10 w-full rounded-xl bg-white shadow-xl',
                        sizeClasses[size],
                    ]"
                >
                    <div
                        v-if="title"
                        class="flex items-center justify-between border-b border-[#B5B5B5] px-6 py-4"
                    >
                        <h2 id="modal-title" class="text-lg font-semibold text-[#1C1C1A]">
                            {{ title }}
                        </h2>
                        <UButton
                            variant="unstyled"
                            class="rounded-md p-1 text-[#B5B5B5] hover:bg-[#F5F5F5] hover:text-[#1C1C1A] focus-visible:ring-2 focus-visible:ring-[#1DA05E] focus-visible:outline-none"
                            aria-label="Close dialog"
                            @click="emit('close')"
                        >
                            <svg
                                class="size-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                                />
                            </svg>
                        </UButton>
                    </div>
                    <div class="p-6">
                        <slot />
                    </div>
                    <div v-if="$slots.footer" class="border-t border-[#B5B5B5] px-6 py-4">
                        <slot name="footer" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>
