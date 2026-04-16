<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    title: 'Settings — BAS World',
})

useHead({ title: 'Settings — BAS World' })

const { prefs, setFontSize, toggleHighContrast, toggleReducedMotion } = useA11y()
const authStore = useAuthStore()

const fontSizes = ['default', 'large', 'x-large'] as const
const defaultQty = ref<'1' | '5' | '10'>('1')
const autoOpenDrawer = ref(false)
</script>

<template>
    <div class="mx-auto max-w-2xl space-y-6">
        <h1 class="text-2xl font-bold text-[#1C1C1A]">Settings</h1>

        <UCard>
            <template #header>
                <h2 class="font-semibold text-[#1C1C1A]">Account</h2>
            </template>
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium text-[#1C1C1A]">{{ authStore.user?.name }}</p>
                    <p class="text-sm text-[#B5B5B5]">{{ authStore.user?.email }}</p>
                    <UBadge class="mt-1">{{ authStore.user?.role }}</UBadge>
                </div>
                <UButton variant="outline" size="sm" @click="authStore.logout()">Logout</UButton>
            </div>
        </UCard>

        <UCard>
            <template #header>
                <h2 class="font-semibold text-[#1C1C1A]">Accessibility</h2>
            </template>
            <div class="space-y-5">
                <fieldset>
                    <legend class="mb-2 text-sm font-medium text-[#1C1C1A]">Font size</legend>
                    <div class="flex gap-2" role="radiogroup" aria-label="Font size">
                        <label
                            v-for="size in fontSizes"
                            :key="size"
                            :class="[
                                'flex cursor-pointer items-center justify-center rounded-md border px-4 py-2 text-sm capitalize transition',
                                prefs.fontSize === size
                                    ? 'border-[#1DA05E] bg-[#F5F5F5] text-[#1DA05E]'
                                    : 'border-[#B5B5B5] text-[#1C1C1A] hover:border-[#1C1C1A]',
                            ]"
                        >
                            <input
                                type="radio"
                                :value="size"
                                :checked="prefs.fontSize === size"
                                name="font-size"
                                class="sr-only"
                                @change="setFontSize(size)"
                            />
                            {{ size }}
                        </label>
                    </div>
                </fieldset>

                <div class="flex items-center justify-between">
                    <label for="high-contrast" class="text-sm font-medium text-[#1C1C1A]">
                        High contrast mode
                    </label>
                    <button
                        id="high-contrast"
                        role="switch"
                        :aria-checked="prefs.highContrast"
                        :class="[
                            'relative inline-flex h-6 w-11 items-center rounded-full transition',
                            prefs.highContrast ? 'bg-[#1DA05E]' : 'bg-[#B5B5B5]',
                        ]"
                        @click="toggleHighContrast"
                    >
                        <span
                            :class="[
                                'inline-block size-4 rounded-full bg-white shadow transition',
                                prefs.highContrast ? 'translate-x-6' : 'translate-x-1',
                            ]"
                        />
                    </button>
                </div>

                <div class="flex items-center justify-between">
                    <label for="reduced-motion" class="text-sm font-medium text-[#1C1C1A]">
                        Reduced motion
                    </label>
                    <button
                        id="reduced-motion"
                        role="switch"
                        :aria-checked="prefs.reducedMotion"
                        :class="[
                            'relative inline-flex h-6 w-11 items-center rounded-full transition',
                            prefs.reducedMotion ? 'bg-[#1DA05E]' : 'bg-[#B5B5B5]',
                        ]"
                        @click="toggleReducedMotion"
                    >
                        <span
                            :class="[
                                'inline-block size-4 rounded-full bg-white shadow transition',
                                prefs.reducedMotion ? 'translate-x-6' : 'translate-x-1',
                            ]"
                        />
                    </button>
                </div>
            </div>
        </UCard>

        <UCard>
            <template #header>
                <h2 class="font-semibold text-[#1C1C1A]">Quote Preferences</h2>
            </template>
            <div class="space-y-4">
                <div>
                    <label for="default-qty" class="mb-1 block text-sm font-medium text-[#1C1C1A]">
                        Default quantity when adding parts
                    </label>
                    <select
                        id="default-qty"
                        v-model="defaultQty"
                        class="rounded-md border border-[#B5B5B5] bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#1DA05E] focus:outline-none"
                    >
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div class="flex items-center justify-between">
                    <label for="auto-drawer" class="text-sm font-medium text-[#1C1C1A]">
                        Auto-open quote drawer when adding
                    </label>
                    <button
                        id="auto-drawer"
                        role="switch"
                        :aria-checked="autoOpenDrawer"
                        :class="[
                            'relative inline-flex h-6 w-11 items-center rounded-full transition',
                            autoOpenDrawer ? 'bg-[#1DA05E]' : 'bg-[#B5B5B5]',
                        ]"
                        @click="autoOpenDrawer = !autoOpenDrawer"
                    >
                        <span
                            :class="[
                                'inline-block size-4 rounded-full bg-white shadow transition',
                                autoOpenDrawer ? 'translate-x-6' : 'translate-x-1',
                            ]"
                        />
                    </button>
                </div>
            </div>
        </UCard>
    </div>
</template>
