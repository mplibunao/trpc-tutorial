import { Deps } from '@/server/trpc/context'
import { DatabaseError } from '@/utils/errors'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { err, ok, Result } from 'neverthrow'
import { UserAlreadyExists, UserNotFound } from './accounts.domain'
import { CreateUserInput } from './accounts.schema'

export * as AccountsRepo from './accounts.repo'

export const create = async (
	{ db }: Deps,
	input: CreateUserInput
): Promise<Result<User, UserAlreadyExists | DatabaseError>> => {
	try {
		return ok(await db.user.create({ data: input }))
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return err(new UserAlreadyExists())
			}
		}

		return err(new DatabaseError(error))
	}
}

export const createToken = async (
	{ db }: Deps,
	{ user, redirect }: { user: User; redirect: string }
) => {
	try {
		const token = await db.loginToken.create({
			data: {
				redirect,
				user: { connect: { id: user.id } },
			},
		})
		return ok(token)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}

export const findUser = async ({ db }: Deps, email: string) => {
	try {
		const user = await db.user.findUnique({
			where: { email },
		})

		if (!user) return err(new UserNotFound())

		return ok(user)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}

export const findUserLoginToken = async (
	{ db }: Deps,
	tokenId: string,
	email: string
) => {
	try {
		const userLoginToken = await db.loginToken.findFirst({
			where: {
				id: tokenId,
				user: { email },
			},
			include: { user: true },
		})
		return ok(userLoginToken)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}
