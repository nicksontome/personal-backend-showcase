import { DomainError } from '../errors/DomainError'

/**
 * Email Value Object
 *
 * Immutable, self-validating wrapper around a raw email string.
 * Validation happens at construction time — an invalid Email can never exist.
 * Compared by value, not by reference.
 */
export class Email {
  private constructor(public readonly value: string) {}

  static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new DomainError('Email cannot be empty.', 'INVALID_EMAIL')
    }

    const normalizedEmail = email.trim().toLowerCase()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      throw new DomainError(`Invalid email format: ${email}`, 'INVALID_EMAIL')
    }

    if (normalizedEmail.length > 254) {
      throw new DomainError('Email exceeds maximum length (254 characters).', 'INVALID_EMAIL')
    }

    const [localPart, domain] = normalizedEmail.split('@')
    if (localPart.length === 0 || localPart.length > 64) {
      throw new DomainError('Email local part must be 1–64 characters.', 'INVALID_EMAIL')
    }

    if (domain.length < 4) {
      throw new DomainError('Email domain must be at least 4 characters.', 'INVALID_EMAIL')
    }

    return new Email(normalizedEmail)
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  isFromDomain(domain: string): boolean {
    const [, emailDomain] = this.value.split('@')
    return emailDomain === domain.toLowerCase()
  }

  getDomain(): string {
    const [, domain] = this.value.split('@')
    return domain
  }

  getLocalPart(): string {
    const [localPart] = this.value.split('@')
    return localPart
  }

  toString(): string {
    return this.value
  }
}