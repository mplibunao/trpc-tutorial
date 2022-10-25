import { AccountsRepo } from './accounts.repo'
import { CreateUserInput } from './accounts.schema'
export * as Accounts from './accounts.service'
import { LoginToken, User } from '@prisma/client'
import { Deps } from '@/server/trpc/context'

export const create = async (deps: Deps, input: CreateUserInput) => {
	return AccountsRepo.create(deps, input)
}

export const findUser = async (deps: Deps, email: string) => {
	return AccountsRepo.findUser(deps, email)
}

export const createToken = async (
	deps: Deps,
	args: { user: User; redirect: string }
) => {
	return AccountsRepo.createToken(deps, args)
}

export const generateOtp = (token: LoginToken, user: User) => {
	return Buffer.from(`${token.id}:${user.email}`, 'utf-8').toString('base64')
}
