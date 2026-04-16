export function useAuth() {
  const store = useAuthStore()

  async function login(email: string, password: string) {
    await store.login(email, password)
  }

  async function logout() {
    store.logout()
    await navigateTo('/login')
  }

  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    login,
    logout,
  }
}
