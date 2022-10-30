import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import { loggerLink } from '@trpc/client/links/loggerLink'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import superjson from 'superjson'
import { AppRouter } from '@/server/trpc/app.router'
import { isServer } from '@/utils/ssr'
import { trpc } from '@/utils/trpc'
import { UserContextProvider } from '@/context/user.context'

function MyApp({ Component, pageProps }: AppProps) {
	const { data, isLoading } = trpc.useQuery(['users.me'])
	if (isLoading) return <>Loading user...</>

	return (
		<UserContextProvider value={data}>
			<main>
				<Component {...pageProps} />
			</main>
		</UserContextProvider>
	)
}

export function getBaseUrl() {
	if (!isServer()) return '' // csr should use relative path
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // ssr on vercel should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}` // dev ssr should use localhost
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		const url = `${getBaseUrl()}/api/trpc`
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
