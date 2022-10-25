import { Deps } from '@/server/trpc/context'
import { User } from '@prisma/client'
import { CreateUserInput } from './accounts.schema'

export * as AccountsRepo from './accounts.repo'

export const create = async ({ db }: Deps, input: CreateUserInput) => {
	return db.user.create({ data: input })
}

export const createToken = async (
	{ db }: Deps,
	{ user, redirect }: { user: User; redirect: string }
) => {
	return db.loginToken.create({
		data: { redirect, user: { connect: { id: user.id } } },
	})
}

export const findUser = async ({ db }: Deps, email: string) => {
	return db.user.findUnique({
		where: { email },
	})
}
