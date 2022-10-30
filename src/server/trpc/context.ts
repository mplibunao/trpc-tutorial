import { NextApiRequest, NextApiResponse } from 'next'
import * as trpc from '@trpc/server'
import { db } from '@/server/infra/db'
import { Accounts } from '../modules/accounts/accounts.service'

const deps = { db }
export type Deps = typeof deps

interface CtxUser {
	id: string
	email: string
	name: string
	iat: string
	exp: number
}

function getUserFromRequest(req: NextApiRequest) {
	const { token } = req.cookies
	if (token) {
		try {
			const verified = Accounts.verifyJwt<CtxUser>(token)
			return verified
		} catch (error) {
			return null
		}
	}

	return null
}

export function createContext({
	req,
	res,
}: {
	req: NextApiRequest
	res: NextApiResponse
}) {
	const user = getUserFromRequest(req)
	return { req, res, deps, user }
}

export type Context = ReturnType<typeof createContext>

export function createRouter() {
	return trpc.router<Context>()
}
