import {
	createPostInput,
	CreatePostInput,
} from '@/server/modules/posts/posts.schema'
import { trpc } from '@/utils/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

export default function CreatePostPage(): JSX.Element {
	const router = useRouter()
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<CreatePostInput>({
		resolver: zodResolver(createPostInput),
		defaultValues: { body: '', title: '' },
	})

	const { mutate: createPost, error } = trpc.useMutation('posts.createPost', {
		onSuccess: (post) => {
			router.push(`/posts/${post.id}`)
		},
	})

	const onSubmit = (values: CreatePostInput) => {
		createPost(values)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{error && error.message}
			<h1>Create post</h1>

			<input type='text' placeholder='Your post title' {...register('title')} />
			{errors.title && errors.title.message}

			<br />

			<textarea placeholder='Your post body' {...register('body')} />
			{errors.body && errors.body.message}

			<br />

			<button type='submit'>Create post</button>
		</form>
	)
}
