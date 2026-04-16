<script setup lang="ts">
const sort = defineModel<string>('sort', { default: '' })

const options = [
    { value: '', label: 'Default order' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
]
</script>

<template>
    <div class="flex items-center gap-2">
        <span class="shrink-0 text-sm text-[#1C1C1A]">Sort by:</span>
        <USelect v-model="sort" :options="options" class="min-w-44" />
    </div>
</template>
