import type { User } from '#shared/types'

const DEMO_USERS: Array<{ email: string; password: string; user: User; token: string }> = [
    {
        email: 'j.devries@basworld.com',
        password: 'onderdelen123',
        user: { id: 'u1', email: 'j.devries@basworld.com', name: 'Jan de Vries', role: 'mechanic' },
        token: 'demo-token-mechanic',
    },
    {
        email: 'm.bakker@basworld.com',
        password: 'manager123',
        user: {
            id: 'u2',
            email: 'm.bakker@basworld.com',
            name: 'Maria Bakker',
            role: 'workshop_manager',
        },
        token: 'demo-token-manager',
    },
]

export default defineEventHandler(async (event) => {
    const body = await readBody<{ email?: unknown; password?: unknown }>(event)

    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
        throw createError({ statusCode: 400, message: 'email and password are required' })
    }

    const match = DEMO_USERS.find((u) => u.email === body.email && u.password === body.password)

    if (!match) {
        throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    return { user: match.user, token: match.token }
})
