import { defineStore } from 'pinia'

import type { User } from '#shared/types'

// Demo-only mock auth — NOT production security.
export const useAuthStore = defineStore('auth', () => {
  const authCookie = useCookie<string | null>('auth-token', { default: () => null })
  const userCookie = useCookie<User | null>('auth-user', { default: () => null })

  // Driven by cookie so it survives page refreshes
  const user = computed(() => userCookie.value)
  const isAuthenticated = computed(() => !!userCookie.value && !!authCookie.value)

  async function login(email: string, password: string) {
    const result = await $fetch<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    userCookie.value = result.user
    authCookie.value = result.token
  }

  function logout() {
    userCookie.value = null
    authCookie.value = null
  }

  return { user, isAuthenticated, login, logout }
})
