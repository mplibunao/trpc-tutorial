import { z } from 'zod'

export const createPostInput = z.object({
	title: z
		.string()
		.max(256, { message: 'Title is too long. Max length is 256 characters' }),
	body: z.string().min(10),
})

export type CreatePostInput = z.infer<typeof createPostInput>

export const getPostInput = z.object({
	postId: z.string().uuid(),
})

export type GetPostInput = z.infer<typeof getPostInput>
