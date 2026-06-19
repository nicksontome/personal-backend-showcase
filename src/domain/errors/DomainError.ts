/**
 * Domain Error
 *
 * Base class for all business rule violations in the Domain layer.
 * Application-layer errors extend separately (see UseCaseError), keeping
 * each layer's failure modes distinct.
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message)
    this.name = 'DomainError'
    Object.setPrototypeOf(this, DomainError.prototype)
  }
}

/**
 * Email is already in use.
 */
export class EmailAlreadyUsedError extends DomainError {
  constructor(email: string) {
    super(`The email "${email}" is already registered. Please use a different email.`, 'EMAIL_ALREADY_USED')
    this.name = 'EmailAlreadyUsedError'
    Object.setPrototypeOf(this, EmailAlreadyUsedError.prototype)
  }
}

/**
 * User not found.
 */
export class UserNotFoundError extends DomainError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`, 'USER_NOT_FOUND')
    this.name = 'UserNotFoundError'
    Object.setPrototypeOf(this, UserNotFoundError.prototype)
  }
}

/**
 * Password does not meet validation requirements.
 */
export class InvalidPasswordError extends DomainError {
  constructor(reason: string) {
    super(`Invalid password: ${reason}`, 'INVALID_PASSWORD')
    this.name = 'InvalidPasswordError'
    Object.setPrototypeOf(this, InvalidPasswordError.prototype)
  }
}

/**
 * Password does not match the stored hash.
 */
export class WrongPasswordError extends DomainError {
  constructor() {
    super('The password you entered is incorrect.', 'WRONG_PASSWORD')
    this.name = 'WrongPasswordError'
    Object.setPrototypeOf(this, WrongPasswordError.prototype)
  }
}

/**
 * Generic invalid input, scoped to a specific field.
 */
export class InvalidInputError extends DomainError {
  constructor(field: string, reason: string) {
    super(`Invalid ${field}: ${reason}`, `INVALID_${field.toUpperCase()}`)
    this.name = 'InvalidInputError'
    Object.setPrototypeOf(this, InvalidInputError.prototype)
  }
}