<script setup lang="ts">
import { SearchX,TriangleAlert } from 'lucide-vue-next'

import type { Part } from '#shared/types'

defineProps<{
    parts: Part[]
    error?: string | null
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
    <div>
        <div
            v-if="error"
            role="alert"
            class="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-10 text-center"
        >
            <TriangleAlert class="size-12 text-red-500" aria-hidden="true" />
            <p class="text-red-700">{{ error }}</p>
            <UButton variant="outline" @click="emit('retry')">Try again</UButton>
        </div>

        <div
            v-else-if="!parts.length"
            class="flex flex-col items-center gap-4 rounded-xl border border-dashed border-[#B5B5B5] p-10 text-center"
        >
            <SearchX class="size-12 text-[#B5B5B5]" aria-hidden="true" />
            <p class="text-lg font-medium text-[#1C1C1A]">No parts found</p>
            <p class="text-sm text-[#B5B5B5]">Try adjusting your search or clearing the filters</p>
        </div>

        <ul
            v-else
            class="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label="Parts list"
        >
            <li v-for="part in parts" :key="part.id">
                <PartCard :part="part" />
            </li>
        </ul>
    </div>
</template>
