/**
 * UseCaseError — base class for application-layer errors.
 *
 * Distinct from DomainError (business rule violations).
 * Application errors represent use-case orchestration failures.
 */
export class UseCaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = 'UseCaseError'
    Object.setPrototypeOf(this, UseCaseError.prototype)
  }
}

/**
 * Email is already registered.
 */
export class EmailAlreadyRegisteredError extends UseCaseError {
  constructor(email: string) {
    super(`Email "${email}" is already registered. Please use a different email.`, 'EMAIL_ALREADY_REGISTERED')
    this.name = 'EmailAlreadyRegisteredError'
    Object.setPrototypeOf(this, EmailAlreadyRegisteredError.prototype)
  }
}

/**
 * User not found by ID.
 */
export class UserNotFoundError extends UseCaseError {
  constructor(id: string) {
    super(`User "${id}" not found.`, 'USER_NOT_FOUND')
    this.name = 'UserNotFoundError'
    Object.setPrototypeOf(this, UserNotFoundError.prototype)
  }
}

/**
 * Password does not match the stored hash.
 */
export class IncorrectPasswordError extends UseCaseError {
  constructor() {
    super('The password you entered is incorrect.', 'INCORRECT_PASSWORD')
    this.name = 'IncorrectPasswordError'
    Object.setPrototypeOf(this, IncorrectPasswordError.prototype)
  }
}

/**
 * Generic invalid input to a use case.
 */
export class InvalidInputError extends UseCaseError {
  constructor(message: string) {
    super(message, 'INVALID_INPUT')
    this.name = 'InvalidInputError'
    Object.setPrototypeOf(this, InvalidInputError.prototype)
  }
}