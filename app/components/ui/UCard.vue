<script setup lang="ts">
interface Props {
    as?: 'article' | 'section' | 'div'
    label?: string
    padding?: boolean
}

withDefaults(defineProps<Props>(), {
    as: 'div',
    padding: true,
})
</script>

<template>
    <component
        :is="as"
        :aria-label="label"
        :class="['rounded-lg border border-[#B5B5B5] bg-white shadow-sm', padding ? '' : '']"
    >
        <div v-if="$slots.header" class="border-b border-[#B5B5B5] px-5 py-4">
            <slot name="header" />
        </div>
        <div :class="padding ? 'p-5' : ''">
            <slot />
        </div>
        <div v-if="$slots.footer" class="border-t border-[#B5B5B5] px-5 py-4">
            <slot name="footer" />
        </div>
    </component>
</template>
