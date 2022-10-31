import { trpc } from '@/utils/trpc'
import Link from 'next/link'

export default function PostsPage(): JSX.Element {
	const { data, isLoading } = trpc.useQuery(['posts.getPosts'])

	if (isLoading) return <p>Loading posts...</p>

	return (
		<div>
			{data?.map((post) => (
				<article key={post.id}>
					<p>{post.title}</p>
					<Link href={`/posts/${post.id}`}>Read post</Link>
				</article>
			))}
		</div>
	)
}
