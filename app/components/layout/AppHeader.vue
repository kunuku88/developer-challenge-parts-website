<script setup lang="ts">
import { Search, ClipboardList, Scale, Settings2 } from 'lucide-vue-next'

const route = useRoute()
const quoteStore = useQuoteStore()
const authStore = useAuthStore()
const { logout } = useAuth()

const itemCount = computed(() => quoteStore.itemCount)

const navItems = [
    { label: 'Browse Parts', to: '/', icon: Search },
    { label: 'My Quote', to: '/quote', icon: ClipboardList },
    { label: 'Compare', to: '/compare', icon: Scale },
    { label: 'Settings', to: '/settings', icon: Settings2 },
]

function isActive(to: string) {
    if (to === '/') return route.path === '/'
    return route.path.startsWith(to)
}
</script>

<template>
    <header class="sticky top-0 z-40 border-b border-[#B5B5B5] bg-white shadow-sm">
        <div class="flex h-16 items-center gap-4 px-4 sm:px-6">
            <a href="#main-content" class="skip-link">Skip to main content</a>

            <NuxtLink to="/" class="flex shrink-0 items-center gap-2 font-bold text-[#1DA05E]">
                <img
                    src="https://www.basworld.com/resources/icons/logos/logo-desktop.svg"
                    alt="BAS World logo"
                    class="h-10 w-auto"
                />
            </NuxtLink>

            <nav
                aria-label="Main navigation"
                class="hidden flex-1 items-center justify-center gap-1 lg:flex"
            >
                <NuxtLink
                    v-for="item in navItems"
                    :key="item.to"
                    :to="item.to"
                    :aria-current="isActive(item.to) ? 'page' : undefined"
                    :class="[
                        'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive(item.to)
                            ? 'pointer-events-none bg-[#F5F5F5] text-[#1DA05E]'
                            : 'text-[#1C1C1A] hover:bg-[#F5F5F5] hover:text-[#1C1C1A]',
                    ]"
                >
                    <component :is="item.icon" class="size-4 shrink-0" aria-hidden="true" />
                    {{ item.label }}
                </NuxtLink>
            </nav>

            <div class="ml-auto flex items-center gap-2">
                <NuxtLink
                    to="/quote"
                    class="relative rounded-md p-2 text-[#1C1C1A] hover:bg-[#F5F5F5] focus-visible:ring-2 focus-visible:ring-[#1DA05E] focus-visible:outline-none"
                    :aria-label="`Go to quote list, ${itemCount} item${itemCount !== 1 ? 's' : ''}`"
                >
                    <ClipboardList class="size-6" aria-hidden="true" />
                    <span
                        v-if="itemCount > 0"
                        aria-hidden="true"
                        class="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#1DA05E] text-xs font-bold text-white"
                    >
                        {{ itemCount }}
                    </span>
                </NuxtLink>

                <template v-if="authStore.isAuthenticated">
                    <span class="hidden text-sm text-[#1C1C1A] sm:block">{{
                        authStore.user?.name
                    }}</span>
                    <UButton
                        variant="unstyled"
                        class="rounded-md px-3 py-1.5 text-sm text-[#B5B5B5] hover:bg-[#F5F5F5]"
                        @click="logout()"
                    >
                        Logout
                    </UButton>
                </template>
                <NuxtLink
                    v-else
                    to="/login"
                    class="rounded-md bg-[#1DA05E] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#116037]"
                >
                    Login
                </NuxtLink>
            </div>
        </div>

        <nav aria-label="Mobile navigation" class="flex border-t border-[#B5B5B5] lg:hidden">
            <NuxtLink
                v-for="item in navItems"
                :key="item.to"
                :to="item.to"
                :aria-current="isActive(item.to) ? 'page' : undefined"
                :class="[
                    'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors',
                    isActive(item.to) ? 'text-[#1DA05E]' : 'text-[#B5B5B5]',
                ]"
            >
                <component :is="item.icon" class="size-5 shrink-0" aria-hidden="true" />
                {{ item.label }}
            </NuxtLink>
        </nav>
    </header>
</template>
