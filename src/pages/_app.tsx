import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { getTrpcBaseUrl } from '@/utils/url'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
import { AppRouter } from '@/server/trpc/app.router'

function MyApp({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		const url = `${getTrpcBaseUrl()}/api/trpc`
		const links = [
			loggerLink({
				enabled: (opts) =>
					process.env.NODE_ENV === 'development' ||
					(opts.direction === 'down' && opts.result instanceof Error),
			}),
			httpBatchLink({ url, maxBatchSize: 10 }),
		]
		return {
			links,
			url,
			queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
			headers() {
				if (ctx?.req) {
					return { ...ctx.req.headers, 'x-ssr': '1' }
				}

				return {}
			},
			transformer: superjson,
		}
	},
	ssr: false,
})(MyApp)
