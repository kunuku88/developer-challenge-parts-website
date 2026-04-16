<script setup lang="ts">
const brands = defineModel<string[]>('brands', { default: () => [] })
const condition = defineModel<string>('condition', { default: '' })
const category = defineModel<string>('category', { default: '' })

const emit = defineEmits<{ clear: [] }>()

const brandOptions = ['DAF', 'MAN', 'Scania', 'Volvo', 'Mercedes-Benz', 'Iveco']
const conditionOptions = [
    { value: '', label: 'All conditions' },
    { value: 'new', label: 'New' },
    { value: 'used', label: 'Used' },
    { value: 'refurbished', label: 'Refurbished' },
]
const categoryOptions = [
    { value: '', label: 'All categories' },
    { value: 'Body', label: 'Body' },
    { value: 'Engine', label: 'Engine' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Brakes', label: 'Brakes' },
    { value: 'Transmission', label: 'Transmission' },
    { value: 'Suspension', label: 'Suspension' },
]

function toggleBrand(brand: string) {
    if (brands.value.includes(brand)) {
        brands.value = brands.value.filter((b) => b !== brand)
    } else {
        brands.value = [...brands.value, brand]
    }
}

const hasFilters = computed(() => brands.value.length > 0 || !!condition.value || !!category.value)
</script>

<template>
    <aside aria-label="Filter parts" class="space-y-5">
        <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-[#1C1C1A]">Filters</h2>
            <UButton
                v-if="hasFilters"
                variant="unstyled"
                class="text-xs text-[#1DA05E] hover:underline"
                @click="emit('clear')"
            >
                Clear all
            </UButton>
        </div>

        <fieldset>
            <legend class="mb-2 text-xs font-semibold tracking-wide text-[#B5B5B5] uppercase">
                Brand
            </legend>
            <div class="space-y-1.5">
                <label
                    v-for="brand in brandOptions"
                    :key="brand"
                    class="flex cursor-pointer items-center gap-2 text-sm text-[#1C1C1A]"
                >
                    <input
                        type="checkbox"
                        :value="brand"
                        :checked="brands.includes(brand)"
                        class="size-4 rounded border-[#B5B5B5] accent-[#1DA05E] focus:ring-[#1DA05E]"
                        @change="toggleBrand(brand)"
                    />
                    {{ brand }}
                </label>
            </div>
        </fieldset>

        <fieldset>
            <legend class="mb-2 text-xs font-semibold tracking-wide text-[#B5B5B5] uppercase">
                Condition
            </legend>
            <div class="space-y-1.5">
                <label
                    v-for="opt in conditionOptions"
                    :key="opt.value"
                    class="flex cursor-pointer items-center gap-2 text-sm text-[#1C1C1A]"
                >
                    <input
                        type="radio"
                        name="condition"
                        :value="opt.value"
                        :checked="condition === opt.value"
                        class="size-4 border-[#B5B5B5] accent-[#1DA05E] focus:ring-[#1DA05E]"
                        @change="condition = opt.value"
                    />
                    {{ opt.label }}
                </label>
            </div>
        </fieldset>

        <div>
            <label class="mb-2 block text-xs font-semibold tracking-wide text-[#B5B5B5] uppercase">
                Category
            </label>
            <USelect v-model="category" :options="categoryOptions" />
        </div>
    </aside>
</template>
