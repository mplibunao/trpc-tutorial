import { appRouter } from '@/server/trpc/app.router'
import { createContext } from '@/server/trpc/createContext'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext,
	onError: ({ error }) => {
		if (error.code === 'INTERNAL_SERVER_ERROR') {
			console.error('Something went wrong', error) // eslint-disable-line no-console
		} else {
			console.log('error', error) // eslint-disable-line no-console
		}
	},
})
