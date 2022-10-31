import { Context, Deps } from '@/server/trpc/context'
import { DatabaseError } from '@/utils/errors'
import { Post } from '@prisma/client'
import { Result } from 'neverthrow'
import { PostsRepo } from './posts.repo'
import { CreatePostInput, GetPostInput } from './posts.schema'

export * as PostsService from './posts.service'

export const create = async (
	deps: Deps,
	input: CreatePostInput,
	user: Context['user']
): Promise<Result<Post, DatabaseError>> => {
	return PostsRepo.create(deps, input, user)
}

export const getPosts = async (deps: Deps) => {
	return PostsRepo.getPosts(deps)
}

export const getPost = async (deps: Deps, args: GetPostInput) => {
	return PostsRepo.getPost(deps, args)
}
