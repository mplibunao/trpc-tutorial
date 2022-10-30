import { userRouter } from './user.router'
import superjson from 'superjson'
import { createRouter } from './context'
import { postRouter } from './post.router'

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('users.', userRouter)
	.merge('posts.', postRouter)

export type AppRouter = typeof appRouter
