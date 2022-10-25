import { User } from '@prisma/client'
import { sendEmail } from './sendMail'

export * as UserMailer from './userMailer'

interface SendLoginEmailProps {
	user: User
	token: string
	url: string
}

export const sendLoginEmail = async ({
	user,
	token,
	url,
}: SendLoginEmailProps) => {
	sendEmail({
		to: user.email,
		html: `Login by clicking <a href="${url}/login#token=${token}">HERE</a>`,
		subject: 'Login to your account',
	})
}
