<script setup lang="ts">
interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
})

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
    primary:
        'bg-[#1DA05E] text-white hover:bg-[#116037] active:bg-[#116037] focus-visible:ring-[#1DA05E]',
    secondary:
        'bg-[#F5F5F5] text-[#1C1C1A] hover:bg-[#B5B5B5]/20 active:bg-[#B5B5B5]/30 focus-visible:ring-[#B5B5B5]',
    outline:
        'border border-[#1DA05E] text-[#1DA05E] hover:bg-[#F5F5F5] active:bg-[#F5F5F5] focus-visible:ring-[#1DA05E]',
    ghost: 'text-[#1C1C1A] hover:bg-[#F5F5F5] active:bg-[#F5F5F5] focus-visible:ring-[#B5B5B5]',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
}

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
    <button
        :type="type"
        :disabled="isDisabled"
        :aria-disabled="isDisabled"
        :aria-busy="loading"
        :class="[
            'inline-flex items-center justify-center rounded-md font-medium transition-colors',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            variantClasses[variant],
            sizeClasses[size],
            isDisabled ? 'pointer-events-none cursor-not-allowed opacity-50' : 'cursor-pointer',
        ]"
    >
        <span
            v-if="loading"
            aria-hidden="true"
            class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        <slot />
    </button>
</template>
