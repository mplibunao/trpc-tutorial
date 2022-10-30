import dynamic from 'next/dynamic'

/*
 *Problem is passing the token as `#token` instead of normal query params `?token` causes inconsistencies between server and client.
 *router.asPath results in `/login` on server and `/login#token=...` on client.
 *Changing to `?token` fixes this or just use dynamic import and set ssr: false
 */
const LoginForm = dynamic(() => import('@/components/LoginForm'), {
	ssr: false,
})

export default function LoginPage(): JSX.Element {
	return (
		<div>
			<LoginForm />
		</div>
	)
}
