import { trpc } from '@/utils/trpc'
import type { NextPage } from 'next'

const Home: NextPage = () => {
	const { data, error, isLoading } = trpc.useQuery(['users.me'])

	if (isLoading) return <p>Loading...</p>
	if (error) return <code>{JSON.stringify(error)}</code>
	return <div>{JSON.stringify(data)}</div>
}

export default Home
