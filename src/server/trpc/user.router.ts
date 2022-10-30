import { url } from '@/utils/url'
import { serialize } from 'cookie'
import { UserMailer } from '../mailer/userMailer'
import {
	createUserInput,
	createUserOutput,
	requestOtpInput,
	verifyOtpInput,
} from '../modules/accounts/accounts.schema'
import { Accounts } from '../modules/accounts/accounts.service'
import { createRouter } from './context'

export const userRouter = createRouter()
	.mutation('registerUser', {
		input: createUserInput,
		output: createUserOutput,
		async resolve({ input, ctx }) {
			const userResult = await Accounts.create(ctx.deps, input)
			return userResult.match(
				(res) => res,
				(err) => {
					throw err
				}
			)
		},
	})
	.mutation('requestOtp', {
		input: requestOtpInput,
		async resolve({ input, ctx }) {
			const tokenResult = await Accounts.createOtpToken(ctx.deps, input)
			if (tokenResult.isErr()) throw tokenResult.error

			UserMailer.sendLoginEmail({
				url,
				user: tokenResult.value.user,
				token: tokenResult.value.token,
			})

			return true
		},
	})
	.query('verifyOtp', {
		input: verifyOtpInput,
		async resolve({ input, ctx }) {
			const tokenResult = await Accounts.verifyOtp(ctx.deps, input)
			const token = tokenResult.match(
				(result) => result,
				(err) => {
					throw err
				}
			)

			const jwt = Accounts.signJwt({
				email: token?.user.email,
				id: token?.user.id,
			})

			// no samesite: strict/lax and httpOnly: true?
			ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }))

			return { redirect: token?.redirect }
		},
	})
	.query('me', {
		async resolve({ ctx }) {
			return ctx.user
		},
	})
