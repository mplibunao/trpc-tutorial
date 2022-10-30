import {
	requestOtpInput,
	RequestOtpInput,
} from '@/server/modules/accounts/accounts.schema'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

function VerifyToken({ hash }: { hash: string }) {
	const router = useRouter()
	const { data, isLoading } = trpc.useQuery(['users.verifyOtp', { hash }])

	if (isLoading) {
		return <p>Verifying...</p>
	}

	router.push(data?.redirect?.includes('login') ? '/' : data?.redirect || '/')

	return <p>Redirecting...</p>
}

export default function LoginForm(): JSX.Element {
	const router = useRouter()
	const [success, setSuccess] = useState<boolean>(false)

	const { handleSubmit, register } = useForm<RequestOtpInput>({
		resolver: zodResolver(requestOtpInput),
		defaultValues: { email: '' },
	})

	const { mutate: requestOtp, error } = trpc.useMutation(['users.requestOtp'], {
		onSuccess: () => {
			setSuccess(true)
		},
	})

	const onSubmit = (values: RequestOtpInput) => {
		requestOtp({ ...values, redirect: router.asPath })
	}

	const hash = router.asPath.split('#token=')[1]

	if (hash) {
		return <VerifyToken hash={hash} />
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
