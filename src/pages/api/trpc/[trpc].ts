import { appRouter } from '@/server/trpc/app.router'
import { createContext } from '@/server/trpc/context'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
	onError: ({ error, path }) => {
		if (error.code === 'INTERNAL_SERVER_ERROR') {
			console.error(`Something went wrong on ${path}: ${error}`) // eslint-disable-line no-console
		} else {
			console.log('error', path, error) // eslint-disable-line no-console
		}
	},
})
