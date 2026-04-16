<script setup lang="ts">
import type { Part } from '#shared/types'

const { recentPartIds, clearHistory } = useRecentlyViewed()

const { data: parts } = await useAsyncData(
    'recently-viewed-parts',
    async () => {
        if (!recentPartIds.value.length) return []
        const results = await Promise.allSettled(
            recentPartIds.value.map((id) => $fetch<Part>(`/api/parts/${id}`).catch(() => null)),
        )
        return results
            .map((r) => (r.status === 'fulfilled' ? r.value : null))
            .filter((p): p is Part => p !== null)
    },
    { watch: [recentPartIds] },
)
</script>

<template>
    <section v-if="parts?.length" aria-labelledby="recently-viewed-heading" class="mb-6">
        <div class="mb-2 flex items-center justify-between">
            <h2 id="recently-viewed-heading" class="text-sm font-semibold text-[#1C1C1A]">
                Recently Viewed
            </h2>
            <button class="text-xs text-[#B5B5B5] hover:text-[#1C1C1A]" @click="clearHistory">
                Clear history
            </button>
        </div>
        <div class="custom-scrollbar flex gap-3 overflow-x-auto pb-2">
            <NuxtLink
                v-for="part in parts"
                :key="part.id"
                :to="`/parts/${part.id}`"
                class="flex w-36 shrink-0 flex-col gap-1 rounded-lg border border-[#B5B5B5] bg-white p-2 text-xs hover:border-[#1DA05E] focus-visible:ring-2 focus-visible:ring-[#1DA05E] focus-visible:outline-none"
            >
                <img
                    :src="part.image"
                    :alt="part.name"
                    class="h-20 w-full rounded object-cover"
                    loading="lazy"
                />
                <p class="line-clamp-2 font-medium text-[#1C1C1A]">{{ part.name }}</p>
                <p class="font-semibold text-[#1DA05E]">€{{ part.price.toFixed(2) }}</p>
            </NuxtLink>
        </div>
    </section>
</template>
