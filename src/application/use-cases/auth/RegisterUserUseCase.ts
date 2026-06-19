import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import { User } from '../../../domain/entities/User'
import { Email } from '../../../domain/value-objects/Email'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { RegisterUserDTO } from '../../dto/auth/RegisterUserDTO'
import { EmailAlreadyRegisteredError } from '../../errors/UseCaseError'

const BCRYPT_ROUNDS = 10

export interface RegisterUserOutput {
  userId: string
}

/**
 * RegisterUserUseCase
 *
 * Orchestrates user registration:
 * 1. Validate email format and uniqueness
 * 2. Hash password with bcrypt
 * 3. Create User entity
 * 4. Persist to repository
 */
export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: RegisterUserDTO): Promise<RegisterUserOutput> {
    const email = Email.create(input.email)

    const existingUser = await this.userRepository.findByEmail(email.toString())
    if (existingUser) {
      throw new EmailAlreadyRegisteredError(input.email)
    }

    const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS)

    const user = User.create({
      id: randomUUID(),
      email: email.toString(),
      passwordHash: hashedPassword,
      name: input.name,
    })

    await this.userRepository.save(user)

    return { userId: user.id }
  }
}