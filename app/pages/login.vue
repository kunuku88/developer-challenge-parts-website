<script setup lang="ts">
import { Accessibility,Check, Truck } from 'lucide-vue-next'

definePageMeta({ layout: 'auth' })

useHead({ title: 'Login — BAS World' })

const { login } = useAuth()
const router = useRouter()

const email = ref('j.devries@basworld.com')
const password = ref('onderdelen123')
const error = ref('')
const { loading, start: startLoader, stop: stopLoader } = useLoader()
const showPassword = ref(false)

const weatherCodeIcon: Record<number, string> = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌦️',
    53: '🌦️',
    55: '🌦️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    71: '🌨️',
    73: '🌨️',
    75: '🌨️',
    77: '🌨️',
    80: '🌦️',
    81: '🌦️',
    82: '🌦️',
    85: '🌨️',
    86: '🌨️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️',
}

const weather = ref<{ icon: string; temp: number } | null>(null)

const formattedDate = computed(() =>
    new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' }),
)

onMounted(async () => {
    try {
        const data = await $fetch<{ current: { weather_code: number; temperature_2m: number } }>(
            'https://api.open-meteo.com/v1/forecast',
            {
                query: {
                    latitude: 51.6167,
                    longitude: 5.55,
                    current: 'weather_code,temperature_2m',
                    timezone: 'Europe/Amsterdam',
                },
            },
        )
        weather.value = {
            icon: weatherCodeIcon[data.current.weather_code] ?? '🌡️',
            temp: Math.round(data.current.temperature_2m),
        }
    } catch {
        console.log('Failed to fetch weather data')
    }
})

async function handleSubmit() {
    error.value = ''
    startLoader(5000)
    try {
        await login(email.value, password.value)
        await router.push('/')
    } catch {
        error.value = 'Invalid credentials. Please try again.'
        stopLoader()
    }
}
</script>

<template>
    <div class="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
        <div class="flex items-center justify-center bg-[#F5F5F5] p-8">
            <div class="w-full max-w-md">
                <div class="mb-12">
                    <a href="/" class="mb-8 inline-block">
                        <img
                            src="https://www.basworld.com/resources/icons/logos/logo-desktop.svg"
                            alt="BAS World logo"
                            class="h-10 w-auto"
                        />
                    </a>
                    <h1
                        class="font-initial mb-3 font-serif text-[clamp(1.75rem,4vw,2rem)] leading-tight font-black text-[#1C1C1A] uppercase"
                    >
                        Inloggen
                    </h1>

                    <div class="flex items-center justify-between">
                        <a
                            href="/"
                            class="font-semibold text-[#1DA05E] no-underline hover:opacity-80"
                        >
                            Parts Finder v1.0
                        </a>

                        <p class="m-0 text-sm text-[#B5B5B5]">
                            <span class="capitalize">{{ formattedDate }}</span>
                            <template v-if="weather">
                                &nbsp;· {{ weather.icon }} {{ weather.temp }}°C in Veghel
                            </template>
                        </p>
                    </div>
                </div>

                <div
                    v-if="error"
                    class="mb-4 rounded-md border-l-4 border-red-600 bg-red-50 px-4 py-3"
                >
                    <p class="m-0 text-[0.9375rem] font-medium text-red-600">{{ error }}</p>
                </div>

                <form class="flex flex-col gap-6" novalidate @submit.prevent="handleSubmit">
                    <div class="flex flex-col gap-2">
                        <label
                            for="email"
                            class="text-[0.9375rem] font-semibold tracking-[0.01em] text-[#1C1C1A]"
                        >
                            E-mailadres <span class="ml-1 text-[#1DA05E]">*</span>
                        </label>
                        <div class="relative">
                            <IconEmail
                                class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 fill-[#B5B5B5]"
                            />
                            <input
                                id="email"
                                v-model="email"
                                type="email"
                                name="email"
                                placeholder="j.devries@basworld.com"
                                required
                                autocomplete="email"
                                :disabled="loading"
                                class="w-full rounded-lg border-2 border-[#B5B5B5] bg-white py-3.5 pr-4 pl-12 text-base text-[#1C1C1A] transition-all duration-300 outline-none placeholder:text-[#B5B5B5] focus:border-[#1DA05E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,160,94,0.1)] disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label
                            for="password"
                            class="text-[0.9375rem] font-semibold tracking-[0.01em] text-[#1C1C1A]"
                        >
                            Wachtwoord <span class="ml-1 text-[#1DA05E]">*</span>
                        </label>
                        <div class="relative">
                            <IconLock
                                class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 fill-[#B5B5B5]"
                            />
                            <input
                                id="password"
                                v-model="password"
                                :type="showPassword ? 'text' : 'password'"
                                name="password"
                                placeholder="onderdelen123"
                                required
                                autocomplete="current-password"
                                :disabled="loading"
                                class="w-full rounded-lg border-2 border-[#B5B5B5] bg-white py-3.5 pr-12 pl-12 text-base text-[#1C1C1A] transition-all duration-300 outline-none placeholder:text-[#B5B5B5] focus:border-[#1DA05E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(29,160,94,0.1)] disabled:cursor-not-allowed disabled:opacity-60"
                            />
                            <UButton
                                variant="unstyled"
                                class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer border-none bg-transparent p-1 opacity-50 transition-opacity duration-300 hover:opacity-100"
                                aria-label="Wachtwoord tonen/verbergen"
                                @click="showPassword = !showPassword"
                            >
                                <IconEye
                                    :show="showPassword"
                                    class="block h-5 w-5 fill-[#1C1C1A]"
                                />
                            </UButton>
                        </div>
                    </div>

                    <div class="flex items-center justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                name="remember"
                                class="h-[18px] w-[18px] cursor-pointer accent-[#1DA05E]"
                            />
                            <label
                                for="remember"
                                class="cursor-pointer text-[0.9375rem] text-[#B5B5B5] select-none"
                            >
                                Onthoud mij
                            </label>
                        </div>
                        <a
                            href=""
                            class="text-[0.9375rem] font-semibold whitespace-nowrap text-[#1DA05E] no-underline transition-opacity duration-300 hover:underline hover:opacity-80"
                        >
                            Wachtwoord vergeten?
                        </a>
                    </div>

                    <UButton
                        variant="unstyled"
                        type="submit"
                        :disabled="loading"
                        class="mt-2 w-full cursor-pointer rounded-lg border-2 border-[#1DA05E] bg-[#1DA05E] px-8 py-4 font-bold tracking-[0.05em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:border-[#116037] hover:bg-[#116037] hover:shadow-[0_4px_12px_rgba(29,160,94,0.3)] active:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {{ loading ? 'Bezig...' : 'Inloggen' }}
                    </UButton>
                </form>

                <div class="my-6 flex items-center gap-4">
                    <span class="h-px flex-1 bg-[#B5B5B5]" />
                    <span class="text-sm font-medium text-[#B5B5B5]">Of login met</span>
                    <span class="h-px flex-1 bg-[#B5B5B5]" />
                </div>

                <div class="flex flex-col gap-3">
                    <UButton
                        variant="unstyled"
                        class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-[#B5B5B5] bg-white px-6 py-3.5 text-[0.9375rem] font-semibold text-[#1C1C1A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1DA05E] hover:bg-[#F5F5F5] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    >
                        <IconGoogle class="h-5 w-5 shrink-0" />
                        Doorgaan met Google
                    </UButton>

                    <UButton
                        variant="unstyled"
                        class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-[#B5B5B5] bg-white px-6 py-3.5 text-[0.9375rem] font-semibold text-[#1C1C1A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1DA05E] hover:bg-[#F5F5F5] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    >
                        <IconGithub class="h-5 w-5 shrink-0" />
                        Doorgaan met GitHub
                    </UButton>
                </div>
            </div>
        </div>

        <div class="relative hidden overflow-hidden bg-[#1C1C1AD6] lg:flex">
            <img
                src="https://images.openai.com/static-rsc-4/_W3Wkv1raF4LLRQ61WwuyV4K_v9URCwyGh10_gazMHuJ70rEgWUVuZiJPRRbtFMXXJJrBv7D2wKIvnGjIls7se3JyalLP097u6LAggxXjYXVI524gDIlP0ciH6gKeUewc8K0hyKsTMnUL5FJJx9pZYk-WC8Y7qlq1e_N8ohPQbfUepunEbgPM6XmnZJiUqgo?purpose=fullsize"
                alt="Parts listing dashboard screenshot"
                class="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
            />
            <div
                class="relative z-10 flex h-full w-full flex-col items-center justify-center px-16 text-center"
            >
                <div
                    class="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(29,160,94,0.2)]"
                >
                    <Truck class="h-10 w-10 text-[#1DA05E]" aria-hidden="true" />
                </div>
                <h2
                    class="mb-4 font-serif text-[clamp(2rem,3vw,2.5rem)] leading-tight font-black text-white uppercase"
                >
                    Vind Uw Truck Onderdelen
                </h2>
                <p class="m-0 max-w-md text-lg leading-relaxed text-white/90">
                    Zoek, vergelijk en bestel onderdelen voor alle grote truckmerken. Snel,
                    overzichtelijk en direct vanuit uw browser.
                </p>
                <div class="mt-12 flex flex-col items-start gap-4">
                    <div
                        v-for="feature in [
                            'Zoek uit duizenden truck-onderdelen',
                            'Vergelijk onderdelen naast elkaar',
                            'Stel een offerte samen in één klik',
                        ]"
                        :key="feature"
                        class="flex items-center gap-3 text-white/90"
                    >
                        <Check class="h-5 w-5 shrink-0 text-[#1DA05E]" aria-hidden="true" />
                        <span>{{ feature }}</span>
                    </div>
                </div>
                <div class="mt-16 flex items-center gap-2 text-sm text-white/50">
                    <Accessibility class="h-4 w-4" aria-hidden="true" />
                    <span>Toegankelijk platform — WCAG 2.1 AA</span>
                </div>
            </div>
        </div>
    </div>
</template>
