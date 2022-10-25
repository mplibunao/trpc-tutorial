import {
	createUserOutput,
	createUserInput,
	requestOtpInput,
} from '../modules/accounts/accounts.schema'
import { Accounts } from '../modules/accounts/accounts.service'
import { createRouter } from './context'
import * as trpc from '@trpc/server'
import { UserMailer } from '../mailer/userMailer'
import { url } from '@/utils/url'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

export const userRouter = createRouter()
	.mutation('registerUser', {
		input: createUserInput,
		output: createUserOutput,
		async resolve({ input, ctx }) {
			try {
				return await Accounts.create(ctx.deps, input)
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
					cause: error,
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong',
				})
			}
		},
	})
	.mutation('requestOtp', {
		input: requestOtpInput,
		async resolve({ input, ctx }) {
			const { email, redirect } = input

			const user = await Accounts.findUser(ctx.deps, email)
			if (!user) {
				throw new trpc.TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found',
				})
			}

			const token = await Accounts.createToken(ctx.deps, { user, redirect })

			UserMailer.sendLoginEmail({
				user,
				token: Accounts.generateOtp(token, user),
				url,
			})

			return true
		},
	})
