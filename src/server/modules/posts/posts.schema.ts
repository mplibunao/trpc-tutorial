import { z } from 'zod'

export const createPostInput = z.object({
	title: z
		.string()
		.max(256, { message: 'Title is too long. Max length is 256 characters' }),
	body: z.string().min(10, 'Body is too short. Min length is 10 characters'),
})

export type CreatePostInput = z.infer<typeof createPostInput>

export const getPostInput = z.object({
	postId: z.string().uuid({ message: 'Invalid post id' }),
})

export type GetPostInput = z.infer<typeof getPostInput>
