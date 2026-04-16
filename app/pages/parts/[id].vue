<script setup lang="ts">
import type { Part } from '#shared/types'
import { PackageSearch } from 'lucide-vue-next'

const route = useRoute()
const id = computed(() => String(route.params['id']))

const { data: part, error, status } = await useFetch<Part>(() => `/api/parts/${id.value}`)

const quoteStore = useQuoteStore()
const compStore = useComparisonStore()
const { addViewed } = useRecentlyViewed()

const quantity = ref(1)
const selectedColor = ref('')

const inQuote = computed(() => quoteStore.items.some((i) => i.part.id === id.value))
const inCompare = computed(() => compStore.isSelected(id.value))

onMounted(() => {
    if (part.value) {
        addViewed(id.value)
        if (part.value.availableColors?.[0]) {
            selectedColor.value = part.value.availableColors[0]
        }
    }
})

function handleAddToQuote() {
    if (!part.value) return
    if (inQuote.value) {
        quoteStore.removeItem(part.value.id)
    } else {
        for (let i = 0; i < quantity.value; i++) {
            quoteStore.addItem(part.value)
        }
    }
}

useHead({
    title: computed(() => (part.value ? `${part.value.name} — BAS World` : 'Part — BAS World')),
})

const conditionVariant = { new: 'success', used: 'warning', refurbished: 'info' } as const
</script>

<template>
    <div>
        <nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1.5 text-sm text-[#B5B5B5]">
            <NuxtLink to="/" class="hover:text-[#1DA05E]">Home</NuxtLink>
            <span aria-hidden="true">/</span>
            <span v-if="part">{{ part.name }}</span>
            <span v-else>Part</span>
        </nav>

        <div v-if="status === 'pending'" aria-busy="true" aria-label="Loading part details">
            <div class="grid gap-8 lg:grid-cols-2">
                <USkeleton variant="rect" height="h-80" />
                <div class="space-y-3">
                    <USkeleton variant="text" height="h-7" width="w-3/4" />
                    <USkeleton variant="text" height="h-4" width="w-1/2" />
                    <USkeleton variant="text" height="h-10" width="w-1/3" />
                </div>
            </div>
        </div>

        <div
            v-else-if="error"
            role="alert"
            class="flex flex-col items-center gap-4 py-16 text-center"
        >
            <PackageSearch class="size-12 text-[#B5B5B5]" aria-hidden="true" />
            <p class="text-xl font-medium text-[#1C1C1A]">Part not found</p>
            <NuxtLink to="/" class="text-[#1DA05E] hover:underline">Back to parts</NuxtLink>
        </div>

        <div v-else-if="part" class="grid gap-8 lg:grid-cols-2">
            <div class="space-y-4">
                <div
                    class="overflow-hidden rounded-xl border border-[#B5B5B5] bg-[#F5F5F5]"
                    :style="selectedColor ? `box-shadow: inset 0 0 0 4px ${selectedColor}` : ''"
                >
                    <img :src="part.image" :alt="part.name" class="h-80 w-full object-cover" />
                </div>
                <PartColorDropdown
                    v-if="part.availableColors?.length"
                    v-model="selectedColor"
                    :colors="part.availableColors"
                />
            </div>

            <div class="space-y-4">
                <div class="flex flex-wrap gap-2">
                    <UBadge variant="secondary">{{ part.brand }}</UBadge>
                    <UBadge :variant="conditionVariant[part.condition]">{{
                        part.condition
                    }}</UBadge>
                    <UBadge variant="default">{{ part.category }}</UBadge>
                </div>

                <h1 class="text-2xl font-bold text-[#1C1C1A]">{{ part.name }}</h1>

                <dl class="space-y-1 text-sm text-[#1C1C1A]">
                    <div class="flex gap-2">
                        <dt class="font-medium">OEM:</dt>
                        <dd>{{ part.oem }}</dd>
                    </div>
                    <div v-if="part.weight" class="flex gap-2">
                        <dt class="font-medium">Weight:</dt>
                        <dd>{{ part.weight }}</dd>
                    </div>
                    <div v-if="part.dimensions" class="flex gap-2">
                        <dt class="font-medium">Dimensions:</dt>
                        <dd>{{ part.dimensions }}</dd>
                    </div>
                </dl>

                <p
                    :class="[
                        'flex items-center gap-1.5 text-sm font-medium',
                        part.inStock ? 'text-green-600' : 'text-red-500',
                    ]"
                >
                    <span
                        aria-hidden="true"
                        class="size-2 rounded-full"
                        :class="part.inStock ? 'bg-green-500' : 'bg-red-400'"
                    />
                    {{ part.inStock ? 'In stock' : 'Out of stock' }}
                </p>

                <p class="text-3xl font-bold text-[#1C1C1A]">€{{ part.price.toFixed(2) }}</p>

                <p class="text-sm leading-relaxed text-[#1C1C1A]">{{ part.description }}</p>

                <ul v-if="part.compatibleModels?.length" class="space-y-1">
                    <li class="text-xs font-semibold tracking-wide text-[#B5B5B5] uppercase">
                        Compatible with
                    </li>
                    <li
                        v-for="model in part.compatibleModels"
                        :key="model"
                        class="text-sm text-[#1C1C1A]"
                    >
                        • {{ model }}
                    </li>
                </ul>

                <div class="flex items-center gap-3 pt-2">
                    <div
                        v-if="!inQuote"
                        class="flex items-center rounded border border-[#B5B5B5]"
                        role="group"
                        aria-label="Quantity"
                    >
                        <button
                            class="px-3 py-2 text-[#1C1C1A] hover:bg-[#F5F5F5] disabled:opacity-40"
                            aria-label="Decrease quantity"
                            :disabled="quantity <= 1"
                            @click="quantity--"
                        >
                            −
                        </button>
                        <span class="w-10 text-center text-sm">{{ quantity }}</span>
                        <button
                            class="px-3 py-2 text-[#1C1C1A] hover:bg-[#F5F5F5]"
                            aria-label="Increase quantity"
                            @click="quantity++"
                        >
                            +
                        </button>
                    </div>

                    <UButton
                        size="lg"
                        :variant="inQuote ? 'outline' : 'primary'"
                        :aria-label="`${inQuote ? 'Remove' : 'Add'} ${part.name} ${inQuote ? 'from' : 'to'} quote`"
                        @click="handleAddToQuote"
                    >
                        {{ inQuote ? 'In Quote — Remove ✓' : 'Add to Quote' }}
                    </UButton>

                    <UButton
                        size="lg"
                        variant="ghost"
                        :aria-label="`${inCompare ? 'Remove from' : 'Add to'} comparison`"
                        :aria-pressed="inCompare"
                        @click="
                            inCompare
                                ? compStore.removeFromCompare(part.id)
                                : compStore.addToCompare(part)
                        "
                    >
                        {{ inCompare ? '⚖️ Comparing' : '⚖️ Compare' }}
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>
