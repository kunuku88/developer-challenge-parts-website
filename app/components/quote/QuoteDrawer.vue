<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useQuoteStore()

const drawerRef = ref<HTMLElement | null>(null)
const previousFocus = ref<HTMLElement | null>(null)

watch(
    () => props.open,
    (val) => {
        if (val) {
            previousFocus.value = document.activeElement as HTMLElement
            nextTick(() => {
                drawerRef.value?.querySelector<HTMLElement>('button, [href]')?.focus()
            })
        } else {
            nextTick(() => previousFocus.value?.focus())
        }
    },
)

function handleKeydown(e: KeyboardEvent) {
    if (!props.open) return
    if (e.key === 'Escape') {
        emit('close')
        return
    }
    if (e.key === 'Tab' && drawerRef.value) {
        const els = drawerRef.value.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault()
            last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault()
            first?.focus()
        }
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="drawer">
            <div v-if="open" class="fixed inset-0 z-50" @keydown="handleKeydown">
                <div
                    aria-hidden="true"
                    class="absolute inset-0 bg-black/40"
                    @click="emit('close')"
                />

                <div
                    ref="drawerRef"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="quote-drawer-title"
                    class="absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-xl sm:w-96"
                >
                    <div
                        class="flex items-center justify-between border-b border-[#B5B5B5] px-4 py-4"
                    >
                        <h2 id="quote-drawer-title" class="text-lg font-semibold text-[#1C1C1A]">
                            Quote List
                            <span
                                v-if="store.itemCount"
                                class="ml-1 text-sm font-normal text-[#B5B5B5]"
                            >
                                ({{ store.itemCount }} item{{ store.itemCount !== 1 ? 's' : '' }})
                            </span>
                        </h2>
                        <button
                            class="rounded-md p-1.5 text-[#B5B5B5] hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-[#1DA05E] focus-visible:outline-none"
                            aria-label="Close quote drawer"
                            @click="emit('close')"
                        >
                            <svg
                                class="size-5"
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

                    <div class="flex-1 overflow-y-auto px-4">
                        <div
                            v-if="!store.items.length"
                            class="flex flex-col items-center gap-3 py-12 text-center"
                        >
                            <ClipboardList class="size-10 text-[#B5B5B5]" aria-hidden="true" />
                            <p class="text-[#B5B5B5]">Your quote list is empty</p>
                            <NuxtLink
                                to="/"
                                class="text-sm text-[#1DA05E] hover:underline"
                                @click="emit('close')"
                            >
                                Browse parts
                            </NuxtLink>
                        </div>
                        <ul v-else class="divide-y divide-[#F5F5F5]" aria-label="Quote items">
                            <QuoteItem
                                v-for="item in store.items"
                                :key="item.part.id"
                                :item="item"
                                @remove="store.removeItem"
                                @update-qty="store.updateQuantity"
                            />
                        </ul>
                    </div>

                    <div
                        v-if="store.items.length"
                        class="space-y-3 border-t border-[#B5B5B5] px-4 py-4"
                    >
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-[#1C1C1A]">Total ({{ store.itemCount }} items)</span>
                            <span class="text-lg font-bold text-[#1C1C1A]"
                                >€{{ store.totalPrice.toFixed(2) }}</span
                            >
                        </div>
                        <div class="flex gap-2">
                            <NuxtLink
                                to="/quote"
                                class="flex-1 rounded-lg bg-[#1DA05E] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#116037]"
                                @click="emit('close')"
                            >
                                View Full Quote
                            </NuxtLink>
                            <QuoteExportPdf />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
    transition:
        transform 0.25s ease,
        opacity 0.25s ease;
}
.drawer-enter-from,
.drawer-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
