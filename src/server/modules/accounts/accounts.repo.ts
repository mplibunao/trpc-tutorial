import { PrismaClient } from '@prisma/client'
import { CreateUserInput } from './accounts.schema'

export * as AccountsRepo from './accounts.repo'

export const create = async (input: CreateUserInput, db: PrismaClient) => {
	return db.user.create({ data: input })
}
