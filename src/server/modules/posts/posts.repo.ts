import { Context, Deps } from '@/server/trpc/context'
import { DatabaseError, DomainError } from '@/utils/errors'
import { Post } from '@prisma/client'
import { err, ok, Result } from 'neverthrow'
import { CreatePostInput, GetPostInput } from './posts.schema'

export * as PostsRepo from './posts.repo'

export class PostNotFound extends DomainError {
	constructor(message = 'Post not found') {
		super({ message, code: 'NOT_FOUND' })
	}
}

export const create = async (
	{ db }: Deps,
	input: CreatePostInput,
	user: Context['user']
): Promise<Result<Post, DatabaseError>> => {
	try {
		const post = await db.post.create({
			data: {
				...input,
				user: { connect: { id: user?.id } },
			},
		})

		return ok(post)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}

export const getPosts = async ({ db }: Deps) => {
	try {
		const posts = await db.post.findMany({
			include: { user: true },
		})

		return ok(posts)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}

export const getPost = async ({ db }: Deps, { postId }: GetPostInput) => {
	try {
		const post = await db.post.findUnique({
			where: { id: postId },
			include: { user: true },
		})

		if (!post) return err(new PostNotFound())

		return ok(post)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}
