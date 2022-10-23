import { NextApiRequest, NextApiResponse } from 'next'
import * as trpc from '@trpc/server'
import { db } from '@/server/infra/db'

export function createContext({
	req,
	res,
}: {
	req: NextApiRequest
	res: NextApiResponse
}) {
	return { req, res, db }
}

export type Context = ReturnType<typeof createContext>

export function createRouter() {
	return trpc.router<Context>()
}
