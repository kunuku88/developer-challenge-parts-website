<script setup lang="ts">
import { Check,ChevronDown } from 'lucide-vue-next'
import { useId } from 'vue'

interface SelectOption {
    value: string
    label: string
}

interface Props {
    modelValue?: string
    options: SelectOption[]
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: string
    id?: string
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const internalId = useId()
const triggerId = computed(() => props.id ?? `select-trigger-${internalId}`)
const listboxId = computed(() => `${triggerId.value}-listbox`)
const errorId = computed(() => `${triggerId.value}-error`)

const open = ref(false)
const activeIndex = ref(0)
const containerRef = ref<HTMLElement | null>(null)

const selectedOption = computed(() => props.options.find((o) => o.value === props.modelValue))
const displayLabel = computed(() => selectedOption.value?.label ?? props.placeholder ?? 'Select...')

function openDropdown() {
    if (props.disabled) return
    activeIndex.value = Math.max(
        props.options.findIndex((o) => o.value === props.modelValue),
        0,
    )
    open.value = true
}

function select(opt: SelectOption) {
    emit('update:modelValue', opt.value)
    open.value = false
}

function handleKeydown(e: KeyboardEvent) {
    if (!open.value) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault()
            openDropdown()
        }
        return
    }
    if (e.key === 'Escape') {
        open.value = false
    } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        activeIndex.value = Math.min(activeIndex.value + 1, props.options.length - 1)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        activeIndex.value = Math.max(activeIndex.value - 1, 0)
    } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        const opt = props.options[activeIndex.value]
        if (opt) select(opt)
    }
}

function onMousedown(e: MouseEvent) {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        open.value = false
    }
}

onMounted(() => document.addEventListener('mousedown', onMousedown))
onUnmounted(() => document.removeEventListener('mousedown', onMousedown))
</script>

<template>
    <div ref="containerRef" class="relative flex flex-col gap-1">
        <label v-if="label" :for="triggerId" class="text-sm font-medium text-[#1C1C1A]">
            {{ label }}
        </label>

        <UButton
            :id="triggerId"
            variant="unstyled"
            :disabled="disabled"
            :aria-expanded="open"
            aria-haspopup="listbox"
            :aria-controls="listboxId"
            :aria-describedby="error ? errorId : undefined"
            :aria-invalid="!!error || undefined"
            :class="[
                'flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-left text-sm',
                'focus:ring-2 focus:ring-[#1DA05E] focus:outline-none',
                error ? 'border-red-500' : open ? 'border-[#1DA05E]' : 'border-[#B5B5B5]',
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                selectedOption ? 'text-[#1C1C1A]' : 'text-[#B5B5B5]',
            ]"
            @click="open ? (open = false) : openDropdown()"
            @keydown="handleKeydown"
        >
            <span>{{ displayLabel }}</span>
            <ChevronDown
                :class="[
                    'size-4 shrink-0 text-[#B5B5B5] transition-transform duration-150',
                    open && 'rotate-180',
                ]"
                aria-hidden="true"
            />
        </UButton>

        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <ul
                v-if="open"
                :id="listboxId"
                role="listbox"
                :aria-activedescendant="
                    activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
                "
                class="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-md border border-[#B5B5B5] bg-white py-1 shadow-lg"
            >
                <li
                    v-for="(opt, i) in options"
                    :id="`${listboxId}-opt-${i}`"
                    :key="opt.value"
                    role="option"
                    :aria-selected="opt.value === modelValue"
                    :class="[
                        'flex cursor-pointer items-center justify-between px-3 py-2 text-sm',
                        i === activeIndex
                            ? 'bg-[#1DA05E] text-white'
                            : 'text-[#1C1C1A] hover:bg-[#F5F5F5]',
                    ]"
                    @mouseenter="activeIndex = i"
                    @click="select(opt)"
                >
                    {{ opt.label }}
                    <Check
                        v-if="opt.value === modelValue"
                        :class="[
                            'size-3.5 shrink-0',
                            i === activeIndex ? 'text-white' : 'text-[#1DA05E]',
                        ]"
                        aria-hidden="true"
                    />
                </li>
            </ul>
        </Transition>

        <p v-if="error" :id="errorId" role="alert" class="text-xs text-red-600">
            {{ error }}
        </p>
    </div>
</template>
