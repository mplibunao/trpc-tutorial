import { SECRET } from '@/constants'
import { Deps } from '@/server/trpc/context'
import { DatabaseError, InternalServerError } from '@/utils/errors'
import { LoginToken, User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
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
	try {
		return ok(await AccountsRepo.create(deps, input))
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return err(new UserAlreadyExists())
			}
		}

		return err(new InternalServerError(error))
	}
}

type FindUserError = UserNotFound | DatabaseError
export const findUser = async (
	deps: Deps,
	email: string
): Promise<Result<User, FindUserError>> => {
	try {
		const user = await AccountsRepo.findUser(deps, email)
		if (!user) return err(new UserNotFound())

		return ok(user)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}

export const createOtpToken = async (
	deps: Deps,
	args: RequestOtpInput
): Promise<
	Result<{ token: string; user: User }, DatabaseError | FindUserError>
> => {
	const userResult = await findUser(deps, args.email)
	if (userResult.isErr()) return err(userResult.error)
	const user = userResult.value

	try {
		const token = await AccountsRepo.createToken(deps, {
			user,
			redirect: args.redirect,
		})

		return ok({ token: generateOtp(token, user), user })
	} catch (error) {
		return err(new DatabaseError(error))
	}
}

export const verifyOtp = async (deps: Deps, { hash }: VerifyOtpInput) => {
	const [id, email] = decodeOtp(hash)
	if (!id || !email) return err(new InvalidOtp())

	try {
		const token = await AccountsRepo.findUserLoginToken(deps, id, email)
		return ok(token)
	} catch (error) {
		return err(new DatabaseError(error))
	}
}

export const signJwt = (data: object) => {
	return jwt.sign(data, SECRET, {
		expiresIn: '1d',
	})
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

function verifyJwt<T>(token: string) {
	return jwt.verify(token, SECRET) as T
}
