import { DomainError } from '@/utils/errors'

export class UserNotFound extends DomainError {
	constructor(message = 'User not found') {
		super({ message, code: 'NOT_FOUND' })
	}
}

export class UserAlreadyExists extends DomainError {
	constructor(message = 'User already exists') {
		super({ message, code: 'CONFLICT' })
	}
}

export class InvalidOtp extends DomainError {
	constructor(message = 'Invalid token') {
		super({ message, code: 'FORBIDDEN' })
	}
}
