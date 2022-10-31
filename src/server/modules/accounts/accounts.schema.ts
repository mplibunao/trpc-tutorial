import { z } from 'zod'

export const createUserInput = z.object({
	name: z.string(),
	email: z.string().email({ message: 'Invalid email' }),
})

export type CreateUserInput = z.infer<typeof createUserInput>

export const createUserOutput = z.object({
	name: z.string(),
	email: z.string().email({ message: 'Invalid email' }),
})

export type CreateUserOutput = z.infer<typeof createUserOutput>

export const requestOtpInput = z.object({
	email: z.string().email({ message: 'Invalid email' }),
	redirect: z.string().default('/'),
})

export type RequestOtpInput = z.infer<typeof requestOtpInput>

export const verifyOtpInput = z.object({
	hash: z.string(),
})

export type VerifyOtpInput = z.infer<typeof verifyOtpInput>
