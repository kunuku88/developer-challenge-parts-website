<script setup lang="ts">
import { Scale } from 'lucide-vue-next'

import type { Part } from '#shared/types'

const compStore = useComparisonStore()
const quoteStore = useQuoteStore()

definePageMeta({ title: 'Compare Parts — BAS World' })
useHead({ title: 'Compare Parts — BAS World' })

const parts = computed(() => compStore.selectedParts)

const lowestPrice = computed(() => {
    if (!parts.value.length) return null
    return Math.min(...parts.value.map((p: Part) => p.price))
})

function isInQuote(partId: string) {
    return quoteStore.items.some((i: { part: Part }) => i.part.id === partId)
}

const rows: Array<{ label: string; key: keyof (typeof parts.value)[number] }> = [
    { label: 'Brand', key: 'brand' },
    { label: 'Condition', key: 'condition' },
    { label: 'Category', key: 'category' },
    { label: 'OEM', key: 'oem' },
    { label: 'In Stock', key: 'inStock' },
    { label: 'Weight', key: 'weight' },
    { label: 'Dimensions', key: 'dimensions' },
]
</script>

<template>
    <div>
        <h1 class="mb-6 text-2xl font-bold text-[#1C1C1A]">Compare Parts</h1>

        <div v-if="!parts.length" class="flex flex-col items-center gap-4 py-16 text-center">
            <Scale class="size-12 text-[#B5B5B5]" aria-hidden="true" />
            <p class="text-lg text-[#1C1C1A]">No parts selected for comparison</p>
            <NuxtLink to="/" class="text-[#1DA05E] hover:underline"
                >Browse parts and add to compare</NuxtLink
            >
        </div>

        <template v-else>
            <div
                class="custom-scrollbar overflow-x-auto rounded-xl border border-[#B5B5B5] bg-white shadow-sm"
            >
                <table class="w-full min-w-max text-sm">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                class="w-32 border-b border-[#B5B5B5] bg-[#F5F5F5] px-4 py-3 text-left text-xs font-semibold tracking-wide text-[#B5B5B5] uppercase"
                            >
                                Feature
                            </th>
                            <th
                                v-for="part in parts"
                                :key="part.id"
                                scope="col"
                                class="border-b border-[#B5B5B5] bg-[#F5F5F5] px-4 py-3 text-left"
                            >
                                <div class="space-y-2">
                                    <img
                                        :src="part.image"
                                        :alt="part.name"
                                        class="h-24 w-full rounded object-cover"
                                    />
                                    <p class="font-semibold text-[#1C1C1A]">{{ part.name }}</p>
                                    <p
                                        :class="[
                                            'text-lg font-bold',
                                            part.price === lowestPrice
                                                ? 'text-green-600'
                                                : 'text-[#1C1C1A]',
                                        ]"
                                    >
                                        €{{ part.price.toFixed(2) }}
                                        <span
                                            v-if="part.price === lowestPrice"
                                            class="ml-1 rounded-full bg-green-100 px-1.5 py-0.5 text-xs font-normal text-green-700"
                                            >Best price</span
                                        >
                                    </p>
                                    <UButton
                                        size="sm"
                                        :variant="isInQuote(part.id) ? 'outline' : 'primary'"
                                        @click="
                                            isInQuote(part.id)
                                                ? quoteStore.removeItem(part.id)
                                                : quoteStore.addItem(part)
                                        "
                                    >
                                        {{ isInQuote(part.id) ? 'In Quote ✓' : 'Add to Quote' }}
                                    </UButton>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#F5F5F5]">
                        <tr v-for="row in rows" :key="row.key" class="even:bg-[#F5F5F5]">
                            <td class="px-4 py-2.5 font-medium text-[#1C1C1A]">{{ row.label }}</td>
                            <td
                                v-for="part in parts"
                                :key="part.id"
                                class="px-4 py-2.5 text-[#1C1C1A]"
                            >
                                <template v-if="row.key === 'inStock'">
                                    <span :class="part.inStock ? 'text-green-600' : 'text-red-500'">
                                        {{ part.inStock ? '✓ In stock' : '✗ Out of stock' }}
                                    </span>
                                </template>
                                <template v-else>
                                    {{ part[row.key] ?? '—' }}
                                </template>
                            </td>
                        </tr>
                        <tr class="even:bg-[#F5F5F5]">
                            <td class="px-4 py-2.5 font-medium text-[#1C1C1A]">Colours</td>
                            <td v-for="part in parts" :key="part.id" class="px-4 py-2.5">
                                <div
                                    v-if="part.availableColors?.length"
                                    class="flex flex-wrap gap-1"
                                >
                                    <span
                                        v-for="c in part.availableColors"
                                        :key="c"
                                        class="size-5 rounded-full border border-[#B5B5B5]"
                                        :style="{ backgroundColor: c }"
                                        :title="c"
                                        :aria-label="c"
                                    />
                                </div>
                                <span v-else class="text-[#B5B5B5]">—</span>
                            </td>
                        </tr>
                        <tr class="even:bg-[#F5F5F5]">
                            <td class="px-4 py-2.5 font-medium text-[#1C1C1A]">
                                Compatible models
                            </td>
                            <td
                                v-for="part in parts"
                                :key="part.id"
                                class="px-4 py-2.5 text-[#1C1C1A]"
                            >
                                <ul v-if="part.compatibleModels?.length" class="space-y-0.5">
                                    <li v-for="m in part.compatibleModels" :key="m" class="text-xs">
                                        {{ m }}
                                    </li>
                                </ul>
                                <span v-else class="text-[#B5B5B5]">—</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-4 flex justify-end">
                <UButton variant="ghost" @click="compStore.clearComparison()"
                    >Clear comparison</UButton
                >
            </div>
        </template>
    </div>
</template>
