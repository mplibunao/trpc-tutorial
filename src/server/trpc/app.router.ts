import { createRouter } from './createRouter'
import { userRouter } from './user.router'
import superjson from 'superjson'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('users.', userRouter)

export type AppRouter = typeof appRouter
