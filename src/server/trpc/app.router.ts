import { userRouter } from './user.router'
import superjson from 'superjson'
import { createRouter } from './context'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('users.', userRouter)

export type AppRouter = typeof appRouter
