<script setup lang="ts">
import type { QuoteItem } from '#shared/types'

defineProps<{ item: QuoteItem }>()
const emit = defineEmits<{ remove: [partId: string]; updateQty: [partId: string, qty: number] }>()
</script>

<template>
    <li class="flex items-start gap-3 py-3">
        <img
            :src="item.part.image"
            :alt="item.part.name"
            class="size-14 shrink-0 rounded-md object-cover"
        />
        <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p class="truncate text-sm font-medium text-[#1C1C1A]">{{ item.part.name }}</p>
            <p class="text-xs text-[#B5B5B5]">OEM: {{ item.part.oem }}</p>
            <div class="mt-1 flex items-center gap-2">
                <div
                    class="flex items-center rounded border border-[#B5B5B5]"
                    role="group"
                    :aria-label="`Quantity for ${item.part.name}`"
                >
                    <button
                        class="px-2 py-1 text-[#1C1C1A] hover:bg-[#F5F5F5] disabled:opacity-40"
                        aria-label="Decrease quantity"
                        :disabled="item.quantity <= 1"
                        @click="emit('updateQty', item.part.id, item.quantity - 1)"
                    >
                        −
                    </button>
                    <span
                        class="w-8 text-center text-sm"
                        :aria-label="`Quantity: ${item.quantity}`"
                    >
                        {{ item.quantity }}
                    </span>
                    <button
                        class="px-2 py-1 text-[#1C1C1A] hover:bg-[#F5F5F5]"
                        aria-label="Increase quantity"
                        @click="emit('updateQty', item.part.id, item.quantity + 1)"
                    >
                        +
                    </button>
                </div>
                <p class="text-sm font-semibold text-[#1C1C1A]">
                    €{{ (item.part.price * item.quantity).toFixed(2) }}
                </p>
            </div>
        </div>
        <button
            class="shrink-0 rounded p-1 text-[#B5B5B5] hover:bg-red-50 hover:text-red-600"
            :aria-label="`Remove ${item.part.name} from quote`"
            @click="emit('remove', item.part.id)"
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
    </li>
</template>
