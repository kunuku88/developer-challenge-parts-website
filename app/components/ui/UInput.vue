<script setup lang="ts">
import { useId } from 'vue'

interface Props {
    modelValue?: string
    label?: string
    placeholder?: string
    type?: string
    error?: string
    icon?: string
    required?: boolean
    disabled?: boolean
    id?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    required: false,
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const internalId = useId()
const inputId = computed(() => props.id ?? `input-${internalId}`)
const errorId = computed(() => `${inputId.value}-error`)

function onInput(e: Event) {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
    <div class="flex flex-col gap-1">
        <label v-if="label" :for="inputId" class="text-sm font-medium text-[#1C1C1A]">
            {{ label }}
            <span v-if="required" aria-hidden="true" class="text-red-500"> *</span>
        </label>

        <div class="relative">
            <span
                v-if="icon"
                aria-hidden="true"
                class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#B5B5B5]"
            >
                {{ icon }}
            </span>

            <input
                :id="inputId"
                :type="type"
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                :aria-describedby="error ? errorId : undefined"
                :aria-invalid="!!error"
                :class="[
                    'w-full rounded-md border bg-white px-3 py-2 text-sm text-[#1C1C1A]',
                    'transition-colors placeholder:text-[#B5B5B5]',
                    'focus:ring-2 focus:ring-[#1DA05E] focus:ring-offset-0 focus:outline-none',
                    icon ? 'pl-10' : '',
                    error ? 'border-red-500 focus:ring-red-500' : 'border-[#B5B5B5]',
                    disabled ? 'cursor-not-allowed bg-[#F5F5F5] opacity-60' : '',
                ]"
                @input="onInput"
            />
        </div>

        <p v-if="error" :id="errorId" role="alert" class="text-xs text-red-600">
            {{ error }}
        </p>
    </div>
</template>
