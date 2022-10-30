export interface sendEmail {
	to: string
	html: string
	subject: string
}

export const sendEmail = async ({ to, html, subject }: sendEmail) => {
	const message = {
		from: '"Jane Doe" <j.doe@example.com>',
		to,
		subject,
		html,
	}
	if (process.env.NODE_ENV === 'production') {
		/*
		 *You can use a specific email service sdk, use fetch to an api or use nodemailer
		 *Not putting nodemailer as default since it's pretty heavy considering there are lighter alternatives
		 */
		throw new Error('No production email implementation provided')
	} else if (process.env.NODE_ENV === 'development') {
		const { default: previewEmail } = await import('preview-email')
		previewEmail(message).then(console.log).catch(console.error)
	}
}
