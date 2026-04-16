<script setup lang="ts">
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
            <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
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
        <button
            v-if="search"
            class="absolute inset-y-0 right-3 flex items-center text-[#B5B5B5] hover:text-[#1C1C1A]"
            aria-label="Clear search"
            @click="clearSearch"
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
    </div>
</template>
