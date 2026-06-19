import { Request, Response } from 'express'
import { OnboardingUseCase } from '../../../application/use-cases/onboarding/OnboardingUseCase'
import { validateOnboardingInput } from '../../../application/dto/onboarding/OnboardingDTO'
import { UserNotFoundError } from '../../../application/errors/UseCaseError'

/**
 * OnboardingController
 *
 * HTTP layer for the onboarding flow. Requires authentication —
 * userId is populated by auth.middleware from the JWT.
 */
export class OnboardingController {
  constructor(private onboardingUseCase: OnboardingUseCase) {}

  async complete(req: Request, res: Response): Promise<void> {
    const userId = req.userId as string

    const validation = validateOnboardingInput(req.body)
    if (!validation.success) {
      res.status(400).json({ error: validation.error })
      return
    }

    try {
      const result = await this.onboardingUseCase.execute(userId, validation.data)
      res.status(201).json(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        res.status(404).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'Internal server error.' })
    }
  }
}