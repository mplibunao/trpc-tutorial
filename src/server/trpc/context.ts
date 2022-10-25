import { NextApiRequest, NextApiResponse } from 'next'
import * as trpc from '@trpc/server'
import { db } from '@/server/infra/db'

const deps = { db }
export type Deps = typeof deps

export function createContext({
	req,
	res,
}: {
	req: NextApiRequest
	res: NextApiResponse
}) {
	return { req, res, deps }
}

export type Context = ReturnType<typeof createContext>

export function createRouter() {
	return trpc.router<Context>()
}
