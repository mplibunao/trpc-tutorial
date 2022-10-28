import { TRPCError } from '@trpc/server'

/*
 *Domain Errors. Eg. UserNotFound, UserAlreadyExists, etc.
 */
export class DomainError extends TRPCError {}

/*
 *Exceptions, DB Errors, etc
 */
export class ApplicationError extends TRPCError {}

export class DatabaseError extends ApplicationError {
	constructor(error: unknown) {
		super({
			cause: error,
			message: 'A database error occurred',
			code: 'INTERNAL_SERVER_ERROR',
		})
	}
}

export class InternalServerError extends ApplicationError {
	constructor(error: unknown) {
		super({
			cause: error,
			message: 'Something went wrong',
			code: 'INTERNAL_SERVER_ERROR',
		})
	}
}
