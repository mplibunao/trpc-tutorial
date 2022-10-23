import { NextApiRequest, NextApiResponse } from 'next'
import * as trpc from '@trpc/server'

export function createContext({
	req,
	res,
}: {
	req: NextApiRequest
	res: NextApiResponse
}) {
	return { req, res }
}

export type Context = ReturnType<typeof createContext>

export function createRouter() {
	return trpc.router<Context>()
}
