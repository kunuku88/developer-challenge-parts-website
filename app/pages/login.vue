<script setup lang="ts">
import { Truck, Check, Accessibility } from 'lucide-vue-next'

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
                            <svg
                                class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 fill-[#B5B5B5]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                                />
                            </svg>
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
                            <svg
                                class="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 fill-[#B5B5B5]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                                />
                            </svg>
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
                                <svg
                                    class="block h-5 w-5 fill-[#1C1C1A]"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        v-if="!showPassword"
                                        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                    />
                                    <path
                                        v-else
                                        d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                                    />
                                </svg>
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
                        <svg
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Doorgaan met Google
                    </UButton>

                    <UButton
                        variant="unstyled"
                        class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-[#B5B5B5] bg-white px-6 py-3.5 text-[0.9375rem] font-semibold text-[#1C1C1A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1DA05E] hover:bg-[#F5F5F5] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    >
                        <svg
                            class="h-5 w-5 shrink-0"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="#000000"
                                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                            />
                        </svg>
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
