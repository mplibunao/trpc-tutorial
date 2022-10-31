import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import Error from 'next/error'

export default function PostPage(): JSX.Element {
	const router = useRouter()
	const postId = router.query.postId

	if (typeof postId !== 'string') return <div>Invalid post id</div>

	const { data, isLoading } = trpc.useQuery(['posts.getPost', { postId }])

	if (isLoading) return <p>Loading post...</p>
	if (!data) return <Error statusCode={404} />

	return (
		<div>
			<h1>{data?.title}</h1>
			<p>{data?.body}</p>
		</div>
	)
}
