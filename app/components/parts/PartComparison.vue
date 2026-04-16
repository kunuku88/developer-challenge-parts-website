<script setup lang="ts">
const compStore = useComparisonStore()

const count = computed(() => compStore.selectedParts.length)
</script>

<template>
    <Teleport to="body">
        <Transition name="slide-up">
            <div
                v-if="count >= 2"
                class="fixed bottom-4 left-1/2 z-40 -translate-x-1/2"
                role="status"
                aria-live="polite"
                :aria-label="`${count} parts selected for comparison`"
            >
                <div
                    class="flex items-center gap-3 rounded-full bg-[#1DA05E] px-5 py-2.5 text-sm font-medium text-white shadow-lg"
                >
                    <span>⚖️ Compare ({{ count }})</span>
                    <NuxtLink
                        to="/compare"
                        class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1DA05E] hover:bg-[#F5F5F5]"
                    >
                        View
                    </NuxtLink>
                    <UButton
                        variant="unstyled"
                        class="text-white/60 hover:text-white"
                        aria-label="Clear comparison selection"
                        @click="compStore.clearComparison()"
                    >
                        ✕
                    </UButton>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
}
</style>
