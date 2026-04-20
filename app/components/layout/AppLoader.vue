<script setup lang="ts">
defineProps<{ visible: boolean }>()
</script>

<template>
    <Transition name="loader">
        <div
            v-if="visible"
            class="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white"
            role="status"
            aria-label="Loading"
            aria-live="polite"
        >
            <img
                src="/img/ui/bas-world-logo.svg"
                alt="BAS World"
                class="logo h-10 w-auto select-none"
                draggable="false"
            />
            <div class="relative mt-6 h-[3px] w-56 overflow-hidden rounded-full bg-[#F0F0F0]">
                <span class="bar absolute inset-y-0 left-0 rounded-full bg-[#1DA05E]" />
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.logo {
    animation: logo-rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes logo-rise {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.bar {
    animation: bar-sweep 1.6s ease-in-out infinite;
}

@keyframes bar-sweep {
    0% {
        left: -50%;
        width: 50%;
    }
    60% {
        left: 100%;
        width: 50%;
    }
    100% {
        left: 100%;
        width: 0;
    }
}

.loader-enter-active {
    transition: opacity 0.1s ease;
}
.loader-leave-active {
    transition: opacity 0.35s ease;
}
.loader-enter-from,
.loader-leave-to {
    opacity: 0;
}
</style>
