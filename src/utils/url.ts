import { isServer } from './ssr'

function getUrl() {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

	return `http://localhost:${process.env.PORT ?? 3000}`
}

export const url = getUrl()

export function getTrpcBaseUrl() {
	if (!isServer()) return '' // csr should use relative path
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // ssr on vercel should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}` // dev ssr should use localhost
}
