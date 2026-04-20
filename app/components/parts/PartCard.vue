<script setup lang="ts">
import { ArrowLeftRight } from 'lucide-vue-next'

import type { Part } from '#shared/types'

const props = defineProps<{ part: Part }>()

const quoteStore = useQuoteStore()
const compStore = useComparisonStore()

const inQuote = computed(() => quoteStore.items.some((item) => item.part.id === props.part.id))
const inCompare = computed(() => compStore.isSelected(props.part.id))
const compareFull = computed(() => compStore.isFull && !inCompare.value)

function toggleQuote() {
    if (inQuote.value) {
        quoteStore.removeItem(props.part.id)
    } else {
        quoteStore.addItem(props.part)
    }
}

function toggleCompare() {
    if (inCompare.value) {
        compStore.removeFromCompare(props.part.id)
    } else {
        compStore.addToCompare(props.part)
    }
}

const conditionVariant = {
    new: 'success',
    used: 'warning',
    refurbished: 'info',
} as const
</script>

<template>
    <article
        class="group flex flex-col rounded-xl border border-[#B5B5B5] bg-white shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-[#1DA05E] hover:shadow-md"
        :aria-label="`${part.name}, ${part.brand}, €${part.price.toFixed(2)}`"
    >
        <div class="relative overflow-hidden rounded-t-xl bg-[#F5F5F5]">
            <NuxtLink :to="`/parts/${part.id}`" tabindex="-1" aria-hidden="true">
                <img
                    :src="part.image"
                    :alt="part.name"
                    class="h-44 w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                />
            </NuxtLink>

            <UButton
                variant="unstyled"
                :aria-label="`${inCompare ? 'Remove from' : 'Add to'} comparison: ${part.name}`"
                :aria-pressed="inCompare"
                :disabled="compareFull"
                :class="[
                    'absolute top-2 right-2 rounded-full p-1.5 text-sm shadow transition',
                    inCompare
                        ? 'bg-[#1DA05E] text-white'
                        : 'bg-white text-[#B5B5B5] hover:bg-[#F5F5F5]',
                    compareFull ? 'cursor-not-allowed opacity-40' : '',
                ]"
                @click.prevent="toggleCompare"
            >
                <ArrowLeftRight class="size-4" aria-hidden="true" />
            </UButton>
        </div>

        <div class="flex flex-1 flex-col gap-2 p-4">
            <div class="flex flex-wrap items-center gap-1.5">
                <UBadge variant="secondary">{{ part.brand }}</UBadge>
                <UBadge :variant="conditionVariant[part.condition]">{{ part.condition }}</UBadge>
                <PartColorBadge
                    v-if="part.availableColors?.length"
                    :colors="part.availableColors"
                />
            </div>

            <NuxtLink
                :to="`/parts/${part.id}`"
                class="rounded focus-visible:ring-2 focus-visible:ring-[#1DA05E] focus-visible:outline-none"
            >
                <h3 class="text-sm leading-snug font-semibold text-[#1C1C1A] hover:text-[#1DA05E]">
                    {{ part.name }}
                </h3>
            </NuxtLink>

            <p class="text-xs text-[#B5B5B5]">OEM: {{ part.oem }}</p>

            <div class="mt-auto flex items-center justify-between pt-2">
                <div>
                    <p class="text-lg font-bold text-[#1C1C1A]">€{{ part.price.toFixed(2) }}</p>
                    <p
                        :class="[
                            'flex items-center gap-1 text-xs',
                            part.inStock ? 'text-green-600' : 'text-red-500',
                        ]"
                    >
                        <span
                            aria-hidden="true"
                            class="size-1.5 rounded-full"
                            :class="part.inStock ? 'bg-green-500' : 'bg-red-400'"
                        />
                        {{ part.inStock ? 'In stock' : 'Out of stock' }}
                    </p>
                </div>

                <UButton
                    size="sm"
                    :variant="inQuote ? 'outline' : 'primary'"
                    :aria-label="`${inQuote ? 'Remove' : 'Add'} ${part.name} ${inQuote ? 'from' : 'to'} quote`"
                    @click="toggleQuote"
                >
                    {{ inQuote ? 'In Quote ✓' : 'Add to Quote' }}
                </UButton>
            </div>
        </div>
    </article>
</template>
