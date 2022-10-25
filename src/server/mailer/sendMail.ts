import nodemailer from 'nodemailer'

export interface sendEmail {
	to: string
	html: string
	subject: string
}

export const sendEmail = async ({ to, html, subject }: sendEmail) => {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	const testAccount = await nodemailer.createTestAccount()

	// create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	})

	const message = {
		from: '"Jane Doe" <j.deo@example.com>',
		to,
		subject,
		html,
	}

	transporter.sendMail(message)

	if (process.env.NODE_ENV === 'development') {
		const { default: previewEmail } = await import('preview-email')
		previewEmail(message).then(console.log).catch(console.error)
	}
}
