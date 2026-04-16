<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

const search = defineModel<string>('search', { default: '' })

const inputRef = ref<HTMLInputElement | null>(null)

function clearSearch() {
    search.value = ''
    inputRef.value?.focus()
}
</script>

<template>
    <div class="relative">
        <label for="part-search" class="sr-only">Search parts by name or OEM number</label>
        <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#B5B5B5]"
        >
            <Search class="size-5" />
        </span>
        <input
            id="part-search"
            ref="inputRef"
            v-model="search"
            type="search"
            placeholder="Search by name or OEM number…"
            class="w-full rounded-lg border border-[#B5B5B5] bg-white py-2.5 pr-10 pl-10 text-sm focus:border-[#1DA05E] focus:ring-2 focus:ring-[#1DA05E] focus:outline-none"
            aria-label="Search parts by name or OEM number"
        />
        <UButton
            v-if="search"
            variant="unstyled"
            class="absolute inset-y-0 right-3 flex items-center text-[#B5B5B5] hover:text-[#1C1C1A]"
            aria-label="Clear search"
            @click="clearSearch"
        >
            <X class="size-4" aria-hidden="true" />
        </UButton>
    </div>
</template>
