import { createRouter } from './context'

export const postRouter = createRouter()
	.mutation('createPost', {})
	.query('posts', {})
	.query('post', {})
