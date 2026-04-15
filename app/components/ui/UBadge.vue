<script setup lang="ts">
interface Props {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'
    dynamic?: boolean
}

withDefaults(defineProps<Props>(), {
    variant: 'default',
    dynamic: false,
})

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
    default: 'bg-[#F5F5F5] text-[#1C1C1A]',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-[#F5F5F5] text-[#1C1C1A]',
    secondary: 'bg-[#F5F5F5] text-[#1C1C1A]',
}
</script>

<template>
    <span
        :role="dynamic ? 'status' : undefined"
        :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
            variantClasses[variant],
        ]"
    >
        <slot />
    </span>
</template>
