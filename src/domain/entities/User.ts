/**
 * User Entity
 *
 * Core domain object representing a user.
 * Immutable — all state changes return a new User instance.
 * Contains only authentication-essential fields.
 */
export class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Factory method — create a new User.
   *
   * Validates basic constraints (name cannot be empty).
   * Password should already be hashed before calling this.
   */
  static create(input: {
    id: string
    email: string
    passwordHash: string
    name: string
  }): User {
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Name cannot be empty.')
    }

    return new User(input.id, input.email, input.passwordHash, input.name, new Date(), new Date())
  }

  /**
   * Update name.
   *
   * Returns a new User instance (immutable pattern).
   */
  updateName(newName: string): User {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Name cannot be empty.')
    }

    return new User(
      this.id,
      this.email,
      this.passwordHash,
      newName,
      this.createdAt,
      new Date(),
    )
  }

  toString(): string {
    return `User(${this.name}, ${this.email})`
  }
}