import { z } from 'zod'

export const createUserInput = z.object({
	name: z.string(),
	email: z.string().email(),
})

export type CreateUserInput = z.infer<typeof createUserInput>

export const createUserOutput = z.object({
	name: z.string(),
	email: z.string().email(),
})

export type CreateUserOutput = z.infer<typeof createUserOutput>

export const requestOtpInput = z.object({
	email: z.string().email(),
	redirect: z.string().default('/'),
})

export type RequestOtpInput = z.infer<typeof requestOtpInput>
