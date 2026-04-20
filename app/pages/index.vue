<script setup lang="ts">
import type { PaginatedResponse, Part } from '#shared/types'

definePageMeta({ title: 'Browse Parts — BAS World' })

const { search, brands, condition, category, sort, filterParams, clearFilters } = usePartsFilter()

const { data, status, error, refresh } = await useFetch<PaginatedResponse<Part>>('/api/parts', {
    query: filterParams,
    lazy: false,
})

const parts = computed(() => data.value?.data ?? [])
const total = computed(() => data.value?.total ?? 0)
const isLoading = computed(() => status.value === 'pending')
const errorMsg = computed(() => (error.value ? 'Failed to load parts. Please try again.' : null))

const { start: startLoader, stop: stopLoader } = useLoader()
watch(
    isLoading,
    (val) => {
        if (val) startLoader(1000)
        else stopLoader()
    },
    { immediate: true },
)

useHead({ title: 'Browse Parts — BAS World' })
</script>

<template>
    <div>
        <PartRecentlyViewed />

        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div class="flex-1">
                <PartSearch v-model:search="search" />
            </div>
            <PartSort v-model:sort="sort" />
        </div>

        <div class="flex gap-6">
            <div class="hidden w-52 shrink-0 lg:block">
                <PartFilters
                    v-model:brands="brands"
                    v-model:condition="condition"
                    v-model:category="category"
                    @clear="clearFilters"
                />
            </div>

            <div class="min-w-0 flex-1">
                <p v-if="!isLoading && !errorMsg" class="mb-3 text-sm text-[#B5B5B5]">
                    {{ total }} part{{ total !== 1 ? 's' : '' }} found
                </p>

                <PartGrid :parts="parts" :error="errorMsg" @retry="refresh()" />
            </div>
        </div>
    </div>
</template>
