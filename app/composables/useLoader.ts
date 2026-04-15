const DEFAULT_DURATION = 2000

export function useLoader() {
    const loading = useState<boolean>('app-loading', () => false)
    const startedAt = useState<number>('app-loading-started-at', () => 0)
    const minDuration = useState<number>('app-loading-duration', () => DEFAULT_DURATION)

    function start(duration: number = DEFAULT_DURATION) {
        minDuration.value = duration
        startedAt.value = Date.now()
        loading.value = true
    }

    function stop() {
        const elapsed = Date.now() - startedAt.value
        const remaining = minDuration.value - elapsed
        if (remaining > 0) {
            setTimeout(() => {
                loading.value = false
            }, remaining)
        } else {
            loading.value = false
        }
    }

    return { loading, start, stop }
}
