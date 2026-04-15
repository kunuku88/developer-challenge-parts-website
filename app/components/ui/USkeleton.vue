<script setup lang="ts">
interface Props {
    variant?: 'rect' | 'circle' | 'text'
    width?: string
    height?: string
    lines?: number
}

withDefaults(defineProps<Props>(), {
    variant: 'rect',
    width: 'w-full',
    height: 'h-4',
    lines: 1,
})
</script>

<template>
    <div aria-hidden="true">
        <template v-if="variant === 'text'">
            <div
                v-for="i in lines"
                :key="i"
                :class="[
                    'animate-pulse rounded bg-[#E5E5E5]',
                    i === lines && lines > 1 ? 'mt-2 w-4/5' : 'mt-2',
                    height,
                    width,
                ]"
            />
        </template>
        <div
            v-else-if="variant === 'circle'"
            :class="['animate-pulse rounded-full bg-[#E5E5E5]', width, height]"
        />
        <div v-else :class="['animate-pulse rounded bg-[#E5E5E5]', width, height]" />
    </div>
</template>
