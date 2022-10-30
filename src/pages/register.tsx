import {
	createUserInput,
	CreateUserInput,
} from '@/server/modules/accounts/accounts.schema'
import { trpc } from '@/utils/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

export default function RegisterPage(): JSX.Element {
	const router = useRouter()
	const { handleSubmit, register } = useForm<CreateUserInput>({
		resolver: zodResolver(createUserInput),
	})
	const { mutate, error } = trpc.useMutation(['users.registerUser'], {
		onSuccess: () => {
			router.push('/login')
		},
	})

	const onSubmit = (values: CreateUserInput) => {
		mutate(values)
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{error && error.message}
				<h1>Register</h1>

				<input
					type='email'
					placeholder='jane.doe@example.com'
					{...register('email')}
				/>
				<br />
				<input type='text' placeholder='Mark' {...register('name')} />

				<button type='submit'>Register</button>
			</form>

			<Link href='/login'>
				<a>Login</a>
			</Link>
		</>
	)
}
