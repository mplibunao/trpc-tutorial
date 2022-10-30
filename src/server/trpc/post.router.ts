import { createRouter } from './context'

export const postRouter = createRouter()
	.mutation('createPost', {})
	.query('getPosts', {})
	.query('getPost', {})
