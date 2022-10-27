import { CreateUserInput } from '@/server/modules/accounts/accounts.schema'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginPage(): JSX.Element {
	const [success, setSuccess] = useState<boolean>(false)

	const { handleSubmit, register } = useForm<CreateUserInput>()

	const { mutate, error } = trpc.useMutation(['users.requestOtp'], {
		onSuccess: () => {
			setSuccess(true)
		},
	})

	const onSubmit = (values: CreateUserInput) => {
		mutate(values)
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				{error && error.message}
				{success && <p>Check your email</p>}

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
