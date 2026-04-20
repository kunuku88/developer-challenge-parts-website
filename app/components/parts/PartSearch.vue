<script setup lang="ts">
import { X } from 'lucide-vue-next'

const search = defineModel<string>('search', { default: '' })
const inputValue = ref(search.value)
const inputRef = ref<HTMLInputElement | null>(null)

watch(search, (val) => {
    if (val !== inputValue.value) inputValue.value = val
})

function submit() {
    search.value = inputValue.value
}

function clearSearch() {
    inputValue.value = ''
    search.value = ''
    inputRef.value?.focus()
}
</script>

<template>
    <div class="relative">
        <label for="part-search" class="sr-only">Search parts by name or OEM number</label>
        <input
            id="part-search"
            ref="inputRef"
            v-model="inputValue"
            type="search"
            placeholder="Search by name or OEM number…"
            class="w-full rounded-lg border border-[#B5B5B5] bg-white py-2.5 pr-24 pl-4 text-sm focus:border-[#1DA05E] focus:ring-2 focus:ring-[#1DA05E] focus:outline-none"
            aria-label="Search parts by name or OEM number"
            @keydown.enter="submit"
        />

        <Transition name="search-btn">
            <UButton
                v-if="inputValue"
                variant="unstyled"
                class="absolute inset-y-0 right-2 my-auto flex h-7 items-center rounded-md bg-[#1DA05E] px-3 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#178a50] hover:shadow-md active:scale-95"
                aria-label="Search"
                @click="submit"
            >
                Search
            </UButton>
        </Transition>

        <UButton
            v-if="!inputValue && search"
            variant="unstyled"
            class="absolute inset-y-0 right-3 flex items-center text-[#B5B5B5] hover:text-[#1C1C1A]"
            aria-label="Clear search"
            @click="clearSearch"
        >
            <X class="size-4" aria-hidden="true" />
        </UButton>
    </div>
</template>

<style scoped>
.search-btn-enter-active {
    transition:
        opacity 0.2s ease-in,
        transform 0.2s ease-in;
}
.search-btn-enter-from {
    opacity: 0;
    transform: translateX(6px);
}
.search-btn-leave-active {
    transition: opacity 0.1s ease-out;
}
.search-btn-leave-to {
    opacity: 0;
}
</style>
