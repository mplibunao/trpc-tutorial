import { CreateUserInput } from '@/server/modules/accounts/accounts.schema'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

function VerifyToken() {
	return <p>Verifying...</p>
}

export default function LoginPage(): JSX.Element {
	const router = useRouter()
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

	const hash = router.asPath.split('#token')[1]

	if (hash) {
		return <VerifyToken />
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
