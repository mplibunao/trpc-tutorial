import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { Context } from './createContext'

export function createRouter() {
	return trpc.router<Context>().transformer(superjson)
}
