import {
	createUserOutputSchema,
	createUserSchema,
} from '../modules/accounts/accounts.schema'
import { Accounts } from '../modules/accounts/accounts.service'
import { createRouter } from './context'

export const userRouter = createRouter().mutation('registerUser', {
	input: createUserSchema,
	output: createUserOutputSchema,
	async resolve({ input, ctx }) {
		return await Accounts.create(input, ctx.db)
	},
})
