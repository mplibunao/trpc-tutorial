import { z } from 'zod'

export const createUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const createUserOutputSchema = z.object({
	name: z.string(),
	email: z.string().email(),
})

export type CreateUserOutput = z.infer<typeof createUserOutputSchema>
