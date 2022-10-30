import { SECRET } from '@/constants'
import { Deps } from '@/server/trpc/context'
import { DatabaseError } from '@/utils/errors'
import { LoginToken, User } from '@prisma/client'
import { err, ok, Result } from 'neverthrow'
import { InvalidOtp, UserAlreadyExists, UserNotFound } from './accounts.domain'
import { AccountsRepo } from './accounts.repo'
import {
	CreateUserInput,
	RequestOtpInput,
	VerifyOtpInput,
} from './accounts.schema'
import jwt from 'jsonwebtoken'
export * as Accounts from './accounts.service'

export const create = async (
	deps: Deps,
	input: CreateUserInput
): Promise<Result<User, UserAlreadyExists | DatabaseError>> => {
	return AccountsRepo.create(deps, input)
}

export const createOtpToken = async (
	deps: Deps,
	args: RequestOtpInput
): Promise<
	Result<{ token: string; user: User }, DatabaseError | UserNotFound>
> => {
	const userResult = await AccountsRepo.findUser(deps, args.email)
	if (userResult.isErr()) return err(userResult.error)
	const user = userResult.value

	const tokenResult = await AccountsRepo.createToken(deps, {
		user,
		redirect: args.redirect,
	})
	if (tokenResult.isErr()) return err(tokenResult.error)

	return ok({ token: generateOtp(tokenResult.value, user), user })
}

export const verifyOtp = async (
	deps: Deps,
	{ hash }: VerifyOtpInput
): Promise<
	Result<(LoginToken & { user: User }) | null, DatabaseError | InvalidOtp>
> => {
	const [id, email] = decodeOtp(hash)
	if (!id || !email) return err(new InvalidOtp())

	return AccountsRepo.findUserLoginToken(deps, id, email)
}

export const signJwt = (data: object) => {
	return jwt.sign(data, SECRET, {
		expiresIn: '1d',
	})
}

export function verifyJwt<T>(token: string) {
	return jwt.verify(token, SECRET) as T
}

const decodeOtp = (hash: string) => {
	return decode(hash).split(':')
}

const generateOtp = (token: LoginToken, user: User) => {
	return encode(`${token.id}:${user.email}`)
}

const decode = (data: string) => {
	return Buffer.from(data, 'base64').toString('utf-8')
}

const encode = (data: string) => {
	return Buffer.from(data, 'utf-8').toString('base64')
}
