import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IUserRepository } from '../../../domain/repositories/IUserRepository'
import { LoginUserDTO } from '../../dto/auth/LoginUserDTO'
import { IncorrectPasswordError, UserNotFoundError } from '../../errors/UseCaseError'

export interface LoginUserOutput {
  token: string
  userId: string
}

/**
 * LoginUserUseCase
 *
 * Orchestrates the login flow:
 * 1. Find user by email
 * 2. Verify password with bcrypt
 * 3. Generate JWT token
 * 4. Return token and userId
 */
export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtSecret: string,
  ) {}

  async execute(input: LoginUserDTO): Promise<LoginUserOutput> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new UserNotFoundError(input.email)
    }

    const isPasswordCorrect = await bcrypt.compare(input.password, user.passwordHash)

    if (!isPasswordCorrect) {
      throw new IncorrectPasswordError()
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      this.jwtSecret,
      {
        expiresIn: '24h',
      },
    )

    return {
      token,
      userId: user.id,
    }
  }
}