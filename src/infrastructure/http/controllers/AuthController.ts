import { Request, Response } from 'express'
import { ZodError } from 'zod'
import { validateRegisterUserInput } from '../../../application/dto/auth/RegisterUserDTO'
import { validateLoginUserInput } from '../../../application/dto/auth/LoginUserDTO'
import { RegisterUserUseCase } from '../../../application/use-cases/auth/RegisterUserUseCase'
import { LoginUserUseCase } from '../../../application/use-cases/auth/LoginUserUseCase'
import {
  EmailAlreadyRegisteredError,
  UserNotFoundError,
  IncorrectPasswordError,
  InvalidInputError,
} from '../../../application/errors/UseCaseError'

/**
 * AuthController
 *
 * HTTP layer — translates between Express request/response objects
 * and the application layer (use cases). Contains no business logic.
 */
export class AuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUserUseCase,
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const validation = validateRegisterUserInput(req.body)
    if (!validation.success) {
      res.status(400).json({ error: validation.error })
      return
    }

    try {
      const result = await this.registerUseCase.execute(validation.data)
      res.status(201).json({
        userId: result.userId,
      })
    } catch (error: unknown) {
      if (error instanceof EmailAlreadyRegisteredError) {
        res.status(409).json({ error: error.message })
        return
      }
      if (error instanceof InvalidInputError) {
        res.status(400).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error.' })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const validation = validateLoginUserInput(req.body)
    if (!validation.success) {
      res.status(400).json({ error: validation.error })
      return
    }

    try {
      const result = await this.loginUseCase.execute(validation.data)
      res.status(200).json({
        token: result.token,
        userId: result.userId,
      })
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError || error instanceof IncorrectPasswordError) {
        res.status(401).json({ error: 'Invalid credentials.' })
        return
      }
      res.status(500).json({ error: 'Internal server error.' })
    }
  }
}