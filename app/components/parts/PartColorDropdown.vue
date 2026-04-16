<script setup lang="ts">
const props = defineProps<{ colors: string[]; modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [color: string] }>()

const selected = ref(props.modelValue ?? props.colors[0] ?? '')

function select(color: string) {
    selected.value = color
    emit('update:modelValue', color)
}
</script>

<template>
    <div>
        <p class="mb-1.5 text-sm font-medium text-[#1C1C1A]">Available colours</p>
        <div role="listbox" aria-label="Select colour" class="flex flex-wrap gap-2">
            <UButton
                v-for="color in colors"
                :key="color"
                variant="unstyled"
                role="option"
                :aria-selected="selected === color"
                :aria-label="color"
                :title="color"
                :class="[
                    'size-7 rounded-full border-2 capitalize transition',
                    selected === color
                        ? 'scale-110 border-[#1DA05E]'
                        : 'border-transparent hover:border-[#B5B5B5]',
                ]"
                :style="{ backgroundColor: color }"
                @click="select(color)"
            />
        </div>
        <p class="mt-1 text-xs text-[#B5B5B5]">Selected: {{ selected }}</p>
    </div>
</template>
