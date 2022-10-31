import { createPostInput, getPostInput } from '../modules/posts/posts.schema'
import { createRouter } from './context'
import * as trpc from '@trpc/server'
import { PostsService } from '../modules/posts/posts.service'

export const postRouter = createRouter()
	.query('getPosts', {
		async resolve({ ctx }) {
			const posts = await PostsService.getPosts(ctx.deps)
			if (posts.isErr()) throw posts.error
			return posts.value
		},
	})
	.query('getPost', {
		input: getPostInput,
		async resolve({ input, ctx }) {
			const post = await PostsService.getPost(ctx.deps, input)
			if (post.isErr()) throw post.error
			return post.value
		},
	})
	.middleware(async ({ ctx, next }) => {
		if (!ctx.user) {
			throw new trpc.TRPCError({
				code: 'UNAUTHORIZED',
			})
		}

		return next()
	})
	.mutation('createPost', {
		input: createPostInput,
		async resolve({ ctx, input }) {
			const post = await PostsService.create(ctx.deps, input, ctx.user)
			if (post.isErr()) throw post.error

			return post.value
		},
	})
