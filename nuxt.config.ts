// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
    },

    modules: ['@pinia/nuxt', '@nuxt/eslint'],

    components: [{ path: '~/components', pathPrefix: false }],

    css: ['~/assets/css/main.css'],

    vite: {
        plugins: [tailwindcss() as any],
    },

    typescript: {
        typeCheck: false, // run separately via `pnpm typecheck`
        tsConfig: {
            compilerOptions: {
                noUncheckedIndexedAccess: true,
                exactOptionalPropertyTypes: true,
                forceConsistentCasingInFileNames: true,
            },
        },
    },

    eslint: {
        config: {
            standalone: false, // use our own eslint.config.mjs
        },
    },
})
