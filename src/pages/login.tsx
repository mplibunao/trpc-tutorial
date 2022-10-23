import { CreateUserInput } from '@/server/modules/accounts/accounts.schema'
//import { trpc } from '@/utils/trpc'
import Link from 'next/link'
//import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'

export default function LoginPage(): JSX.Element {
	//const router = useRouter()
	const { handleSubmit, register } = useForm<CreateUserInput>()
	//const { mutate, error } = trpc.useMutation(['users.create'], {
	//onSuccess: () => {
	//router.push('/login')
	//},
	//})

	const onSubmit = (_values: CreateUserInput) => {
		//mutate(values)
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{/*
				 *{error && error.message}
				 */}
				<h1>Login</h1>
				<input
					type='email'
					placeholder='jane.doe@example.com'
					{...register('email')}
				/>
				<br />
				<button type='submit'>Login</button>
			</form>

			<Link href='/register'>
				<a>Register</a>
			</Link>
		</>
	)
}
