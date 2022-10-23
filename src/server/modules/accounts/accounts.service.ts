import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { AccountsRepo } from './accounts.repo'
import { CreateUserInput } from './accounts.schema'
export * as Accounts from './accounts.service'
import * as trpc from '@trpc/server'
import { PrismaClient } from '@prisma/client'

export const create = async (input: CreateUserInput, db: PrismaClient) => {
	try {
		return await AccountsRepo.create(input, db)
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				throw new trpc.TRPCError({
					code: 'CONFLICT',
					message: 'User already exists',
				})
			}
		}

		throw new trpc.TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: 'Something went wrong',
		})
	}
}
